const fs = require('fs');
const XLSX = require('xlsx');

// Función para analizar duplicados en el Excel
function analyzeDuplicates() {
  console.log("🔍 ANÁLISIS DE DUPLICADOS EN EXCEL");
  
  try {
    // Leer el último archivo Excel usado
    const files = fs.readdirSync('./attached_assets/').filter(f => f.includes('.xlsx'));
    const latestFile = files[files.length - 1];
    console.log(`📄 Analizando archivo: ${latestFile}`);
    
    const filePath = `./attached_assets/${latestFile}`;
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Total de filas en Excel: ${data.length}`);
    
    // Crear hash de cada fila
    const createRowHash = (row) => {
      const rowData = [
        row[0], // A: Título reunión
        row[1], // B: Proyecto/comité  
        row[2], // C: Fecha
        row[3], // D: Hora inicio
        row[4], // E: Hora fin
        row[5], // F: Participantes
        row[6], // G: Tema/Tarea
        row[7], // H: Acta/Minutos
        row[8], // I: Propuesta
        row[9], // J: Código
        row[10], // K: Respuesta
        row[11], // L: Título reunión
      ].map(val => String(val || '').trim()).join('|');
      
      return Buffer.from(rowData).toString('base64');
    };
    
    // Análizar duplicados
    const rowHashes = new Map();
    const duplicates = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const hash = createRowHash(row);
      
      if (rowHashes.has(hash)) {
        duplicates.push({
          filaOriginal: rowHashes.get(hash) + 1,
          filaDuplicada: i + 1,
          codigo: row[9] || 'Sin código',
          tema: row[6] || 'Sin tema',
          datos: row
        });
      } else {
        rowHashes.set(hash, i);
      }
    }
    
    console.log(`🔄 Total de duplicados reales encontrados: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log("\n📋 PRIMEROS 5 DUPLICADOS ENCONTRADOS:");
      duplicates.slice(0, 5).forEach((dup, index) => {
        console.log(`\n${index + 1}. Fila ${dup.filaDuplicada} es duplicado de fila ${dup.filaOriginal}`);
        console.log(`   Código: ${dup.codigo}`);
        console.log(`   Tema: ${dup.tema}`);
        console.log(`   Datos: ${JSON.stringify(dup.datos.slice(0, 4))}`); // Solo primeros 4 campos
      });
    }
    
    // Verificar si todas las filas después de la primera son idénticas
    if (data.length > 1) {
      const primeraFila = data[0];
      let filasIdenticasAPrimera = 0;
      
      for (let i = 1; i < data.length; i++) {
        const hash1 = createRowHash(primeraFila);
        const hash2 = createRowHash(data[i]);
        
        if (hash1 === hash2) {
          filasIdenticasAPrimera++;
        }
      }
      
      console.log(`\n🔍 Filas idénticas a la primera fila: ${filasIdenticasAPrimera} de ${data.length - 1}`);
      
      if (filasIdenticasAPrimera === data.length - 1) {
        console.log("⚠️  PROBLEMA ENCONTRADO: Todas las filas son idénticas a la primera fila!");
        console.log("📝 Primera fila:");
        console.log(JSON.stringify(primeraFila, null, 2));
      }
    }
    
  } catch (error) {
    console.error("❌ Error analizando duplicados:", error);
  }
}

analyzeDuplicates();