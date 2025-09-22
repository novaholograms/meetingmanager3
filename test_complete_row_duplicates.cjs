const XLSX = require('xlsx');

function testDuplicateDetection() {
  console.log("🧪 PRUEBA DETECCIÓN DE DUPLICADOS POR FILA COMPLETA");
  console.log("================================================");
  
  try {
    // Leer el archivo Excel
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Total de filas en Excel: ${data.length}`);
    
    // Función para crear hash de fila (igual que en el importador)
    const createRowHash = (row) => {
      const rowData = [
        row[0], // Columna A: Comité/Proyecto
        row[1], // Columna B: Objetivo
        row[2], // Columna C: Instrumento  
        row[3], // Columna D: Fecha
        row[4], // Columna E: Hora inicio
        row[5], // Columna F: Hora fin
        row[6], // Columna G: Tema/Tarea
        row[7], // Columna H: Acta/Minutos
        row[8], // Columna I: Propuesta
        row[9], // Columna J: Código
        row[10], // Columna K: Respuesta
        row[11], // Columna L: Título reunión
      ].map(val => String(val || '').trim()).join('|');
      
      return Buffer.from(rowData).toString('base64');
    };
    
    // Detectar duplicados dentro del Excel
    const seenHashes = new Set();
    const duplicates = [];
    const unique = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const hash = createRowHash(row);
      
      if (seenHashes.has(hash)) {
        duplicates.push({
          rowIndex: i + 1,
          codigo: row[9],
          tema: row[6],
          fecha: row[3],
          propuesta: row[8],
          hash: hash.substring(0, 20) + '...'
        });
      } else {
        seenHashes.add(hash);
        unique.push({
          rowIndex: i + 1,
          codigo: row[9],
          tema: row[6],
          fecha: row[3]
        });
      }
    }
    
    console.log(`\n✅ ANÁLISIS COMPLETADO:`);
    console.log(`   Filas únicas: ${unique.length}`);
    console.log(`   Filas duplicadas: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log(`\n🔍 DUPLICADOS ENCONTRADOS:`);
      duplicates.slice(0, 10).forEach(dup => {
        console.log(`   Fila ${dup.rowIndex}: Código ${dup.codigo} - "${dup.tema}" (${dup.fecha})`);
      });
      if (duplicates.length > 10) {
        console.log(`   ... y ${duplicates.length - 10} más`);
      }
    } else {
      console.log(`\n🎉 NO HAY DUPLICADOS EXACTOS en el Excel`);
    }
    
    // Analizar códigos repetidos (pero con contenido diferente)
    const codigosMap = new Map();
    unique.forEach(row => {
      const codigo = row.codigo;
      if (codigo && codigo !== 'NULL') {
        if (!codigosMap.has(codigo)) {
          codigosMap.set(codigo, []);
        }
        codigosMap.get(codigo).push(row);
      }
    });
    
    const codigosRepetidos = Array.from(codigosMap.entries())
      .filter(([codigo, rows]) => rows.length > 1)
      .sort(([,a], [,b]) => b.length - a.length);
    
    console.log(`\n📋 CÓDIGOS QUE APARECEN MÚLTIPLES VECES (contenido diferente):`);
    codigosRepetidos.slice(0, 5).forEach(([codigo, rows]) => {
      console.log(`   Código ${codigo}: ${rows.length} instancias diferentes`);
    });
    
    console.log(`\n🎯 CONCLUSIÓN:`);
    console.log(`   Total códigos únicos: ${codigosMap.size}`);
    console.log(`   Códigos con múltiples usos: ${codigosRepetidos.length}`);
    console.log(`   Esto confirma que el mismo código puede usarse en diferentes contextos`);
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

testDuplicateDetection();