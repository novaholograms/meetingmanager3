const fs = require('fs');
const XLSX = require('xlsx');

// Simular la lógica de importación para encontrar el problema
function debugImportLogic() {
  console.log("🔍 DEBUG DE LÓGICA DE IMPORTACIÓN");
  
  try {
    // Leer Excel
    const files = fs.readdirSync('./attached_assets/').filter(f => f.includes('.xlsx'));
    const latestFile = files[files.length - 1];
    console.log(`📄 Archivo: ${latestFile}`);
    
    const filePath = `./attached_assets/${latestFile}`;
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Total filas: ${data.length}`);
    
    // Simular la función createRowHash del backend
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
    
    // Simular la lógica de processedRowsCache del backend
    const processedRowsCache = new Set();
    let duplicatesInExcel = 0;
    let processed = 0;
    
    console.log("\n🔄 SIMULANDO LÓGICA DEL BACKEND:");
    
    for (let i = 0; i < Math.min(data.length, 10); i++) { // Solo primeras 10 filas para debug
      const row = data[i];
      const rowHash = createRowHash(row);
      
      console.log(`\nFila ${i + 1}:`);
      console.log(`  Hash: ${rowHash.substring(0, 20)}...`);
      console.log(`  Datos: [${row.slice(0, 4).join(', ')}]`);
      
      if (processedRowsCache.has(rowHash)) {
        console.log(`  ❌ DUPLICADO DETECTADO - Saltando`);
        duplicatesInExcel++;
      } else {
        console.log(`  ✅ NUEVA FILA - Procesando`);
        processedRowsCache.add(rowHash);
        processed++;
      }
    }
    
    console.log(`\n📊 RESULTADOS DE SIMULACIÓN:`);
    console.log(`  Filas procesadas: ${processed}`);
    console.log(`  Duplicados en Excel: ${duplicatesInExcel}`);
    
    // Comparar filas específicas que el sistema dice que son duplicadas
    if (data.length >= 2) {
      console.log(`\n🔍 COMPARANDO PRIMERA Y SEGUNDA FILA:`);
      const fila1 = data[0];
      const fila2 = data[1];
      const hash1 = createRowHash(fila1);
      const hash2 = createRowHash(fila2);
      
      console.log(`Fila 1 hash: ${hash1.substring(0, 30)}...`);
      console.log(`Fila 2 hash: ${hash2.substring(0, 30)}...`);
      console.log(`Son iguales: ${hash1 === hash2}`);
      
      console.log(`\nFila 1 datos:`);
      for (let j = 0; j < 12; j++) {
        console.log(`  Col ${String.fromCharCode(65 + j)}: "${fila1[j] || ''}"`);
      }
      
      console.log(`\nFila 2 datos:`);
      for (let j = 0; j < 12; j++) {
        console.log(`  Col ${String.fromCharCode(65 + j)}: "${fila2[j] || ''}"`);
      }
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

debugImportLogic();