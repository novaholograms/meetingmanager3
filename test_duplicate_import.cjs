const XLSX = require('xlsx');

console.log("🧪 PRUEBA DE SISTEMA DE DUPLICADOS");
console.log("=================================");

try {
  // Leer el archivo Excel
  const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755787410199.xlsx');
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
  
  // Detectar duplicados exactos
  const processedRowsCache = new Set();
  const duplicateDetails = [];
  let inExcelDuplicates = 0;
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowHash = createRowHash(row);
    
    if (processedRowsCache.has(rowHash)) {
      inExcelDuplicates++;
      duplicateDetails.push({
        rowIndex: i + 1,
        type: 'excel',
        codigo: String(row[9] || 'Sin código'),
        tema: String(row[6] || 'Sin tema'),
        fecha: String(row[3] || 'Sin fecha'),
        razon: 'Fila idéntica ya procesada en esta importación'
      });
      console.log(`🔍 DUPLICADO FILA ${i + 1}: Código ${row[9]} - "${row[6]}"`);
    } else {
      processedRowsCache.add(rowHash);
    }
  }
  
  console.log(`\n✅ RESULTADO:`);
  console.log(`   Filas únicas: ${data.length - inExcelDuplicates}`);
  console.log(`   Duplicados en Excel: ${inExcelDuplicates}`);
  
  // Simular respuesta del servidor
  const serverResponse = {
    totalProcessed: data.length,
    successCount: data.length - inExcelDuplicates,
    errorCount: 0,
    duplicates: {
      inExcel: inExcelDuplicates,
      inDatabase: 0, // Este será 0 en la primera importación
      details: duplicateDetails
    },
    message: `Se procesaron ${data.length - inExcelDuplicates} filas únicas, ${inExcelDuplicates} duplicados omitidos`
  };
  
  console.log(`\n📊 RESPUESTA SIMULADA DEL SERVIDOR:`);
  console.log(JSON.stringify(serverResponse, null, 2));
  
  console.log(`\n🎯 FUNCIONAMIENTO ESPERADO:`);
  console.log(`1. En la interfaz aparecerá el componente DuplicateReport`);
  console.log(`2. Mostrará "${inExcelDuplicates} duplicados detectados"`);
  console.log(`3. Al hacer clic se expandirá mostrando los detalles`);
  console.log(`4. Cada duplicado tendrá: fila, código, tema, fecha y razón`);
  
} catch (error) {
  console.error("❌ Error en la prueba:", error.message);
}