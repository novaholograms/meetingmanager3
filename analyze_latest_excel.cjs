const XLSX = require('xlsx');
const path = require('path');

// Analizar el archivo Excel más reciente
const filePath = path.join(__dirname, 'attached_assets', 'temas dani_subido18julio_1753004545198.xlsx');

try {
  console.log('=== ANÁLISIS DETALLADO DEL ARCHIVO EXCEL ===');
  console.log('Archivo:', filePath);
  
  const workbook = XLSX.readFile(filePath);
  console.log('Hojas disponibles:', workbook.SheetNames);
  
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  
  // Analizar primeras 10 filas con diferentes métodos
  const dataArrays = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: null });
  const dataObjects = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: null });
  
  console.log('\n=== ENCABEZADOS (Fila 1) ===');
  if (dataArrays.length > 0) {
    console.log('Headers:', JSON.stringify(dataArrays[0], null, 2));
  }
  
  console.log('\n=== PRIMERAS 5 FILAS DE DATOS ===');
  for (let i = 1; i < Math.min(6, dataArrays.length); i++) {
    console.log(`\nFila ${i + 1}:`);
    console.log('Array format:', JSON.stringify(dataArrays[i], null, 2));
  }
  
  console.log('\n=== ANÁLISIS DE FILAS CON ERRORES (ALREDEDOR FILA 320) ===');
  const problemRows = [318, 319, 320, 321, 322]; // 0-indexed
  for (const rowIndex of problemRows) {
    if (rowIndex < dataArrays.length) {
      console.log(`\nFila Excel ${rowIndex + 1}:`);
      console.log('Array:', JSON.stringify(dataArrays[rowIndex], null, 2));
      if (rowIndex - 1 < dataObjects.length) {
        console.log('Object keys:', Object.keys(dataObjects[rowIndex - 1]));
      }
    }
  }
  
  console.log('\n=== ESTADÍSTICAS ===');
  console.log('Total filas (arrays):', dataArrays.length);
  console.log('Total filas (objects):', dataObjects.length);
  console.log('Rango hoja:', worksheet['!ref']);
  
} catch (error) {
  console.error('Error al analizar:', error.message);
}