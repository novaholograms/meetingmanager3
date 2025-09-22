const XLSX = require('xlsx');

function analyzeExcelStructure() {
  console.log("🔍 ANÁLISIS DETALLADO DE ESTRUCTURA DEL EXCEL");
  console.log("===============================================");
  
  try {
    // Leer archivo Excel
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Total de filas: ${excelData.length}`);
    
    // Mostrar encabezados
    console.log("\n📋 ENCABEZADOS DEL EXCEL:");
    if (excelData[0]) {
      excelData[0].forEach((header, index) => {
        console.log(`  ${String.fromCharCode(65 + index)}: ${header || 'Sin encabezado'}`);
      });
    }
    
    // Analizar primeras 10 filas completas
    console.log("\n📋 MUESTRA DETALLADA (primeras 10 filas):");
    excelData.slice(0, 11).forEach((row, index) => {
      console.log(`\nFila ${index + 1}:`);
      row.forEach((cell, colIndex) => {
        const column = String.fromCharCode(65 + colIndex);
        console.log(`  ${column}: ${cell || 'vacío'}`);
      });
      if (index === 0) console.log("  ---- (ENCABEZADOS) ----");
    });
    
    // Buscar columnas que podrían contener códigos numéricos
    console.log("\n🔍 BÚSQUEDA DE CÓDIGOS NUMÉRICOS:");
    const dataRows = excelData.slice(1);
    
    for (let colIndex = 0; colIndex < 15; colIndex++) {
      const column = String.fromCharCode(65 + colIndex);
      const columnData = dataRows.map(row => row[colIndex]).filter(cell => cell);
      
      if (columnData.length === 0) continue;
      
      // Verificar si contiene números
      const numericValues = columnData.filter(cell => {
        const asString = String(cell).trim();
        return /^\d+$/.test(asString) && parseInt(asString) > 0 && parseInt(asString) < 1000;
      });
      
      if (numericValues.length > 0) {
        console.log(`\n  Columna ${column} (${excelData[0] ? excelData[0][colIndex] : 'Sin encabezado'}):`);
        console.log(`    - Total valores: ${columnData.length}`);
        console.log(`    - Valores numéricos: ${numericValues.length}`);
        console.log(`    - Muestra: ${numericValues.slice(0, 10).join(', ')}${numericValues.length > 10 ? '...' : ''}`);
        console.log(`    - Rango: ${Math.min(...numericValues.map(v => parseInt(v)))} - ${Math.max(...numericValues.map(v => parseInt(v)))}`);
      }
    }
    
    // Buscar patrones de texto que podrían ser temas/tareas
    console.log("\n📝 BÚSQUEDA DE TEMAS/TAREAS:");
    for (let colIndex = 0; colIndex < 12; colIndex++) {
      const column = String.fromCharCode(65 + colIndex);
      const columnData = dataRows.map(row => row[colIndex]).filter(cell => cell);
      
      if (columnData.length === 0) continue;
      
      // Verificar si contiene texto descriptivo (posibles temas)
      const textValues = columnData.filter(cell => {
        const asString = String(cell).trim();
        return asString.length > 10 && asString.length < 200 && !/^\d+$/.test(asString);
      });
      
      if (textValues.length > 5) {
        console.log(`\n  Columna ${column} (${excelData[0] ? excelData[0][colIndex] : 'Sin encabezado'}):`);
        console.log(`    - Textos descriptivos: ${textValues.length}`);
        console.log(`    - Muestra:`);
        textValues.slice(0, 3).forEach(text => {
          console.log(`      "${String(text).substring(0, 80)}${String(text).length > 80 ? '...' : ''}"`);
        });
      }
    }
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

analyzeExcelStructure();