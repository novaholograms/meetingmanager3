const XLSX = require('xlsx');

function detailedImportAnalysis() {
  console.log("🔍 ANÁLISIS DETALLADO: EXCEL VS BASE DE DATOS");
  console.log("=============================================");
  
  try {
    // Leer archivo Excel
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Filtrar filas válidas del Excel
    const validRows = excelData.slice(1).filter(row => 
      row[6] && row[9] && // Tiene tema (G) y código (J)
      !isNaN(parseInt(row[9])) // El código es numérico
    );
    
    console.log(`📊 Filas válidas en Excel: ${validRows.length}`);
    
    // Extraer todos los códigos únicos del Excel
    const excelCodes = [...new Set(validRows.map(row => parseInt(row[9])).filter(code => !isNaN(code)))].sort((a, b) => a - b);
    
    console.log(`📋 Códigos únicos en Excel: ${excelCodes.length}`);
    console.log(`📈 Rango de códigos en Excel: ${Math.min(...excelCodes)} - ${Math.max(...excelCodes)}`);
    
    // Códigos conocidos en BD (según consulta anterior, rango 1-260)
    const dbCodes = [];
    for (let i = 1; i <= 260; i++) {
      if (i !== 184) { // Sabemos que el 184 falta
        dbCodes.push(i);
      }
    }
    // Eliminar los últimos códigos hasta llegar a 256 tareas
    dbCodes.splice(256); // Mantener solo 256 códigos
    
    console.log(`💾 Códigos estimados en BD: ${dbCodes.length}`);
    
    // Encontrar códigos que están en Excel pero NO en BD
    const missingFromDB = excelCodes.filter(code => !dbCodes.includes(code));
    console.log(`\n❌ CÓDIGOS EN EXCEL PERO NO EN BD (${missingFromDB.length}):`);
    
    if (missingFromDB.length > 0) {
      console.log(`Códigos faltantes: ${missingFromDB.slice(0, 20).join(', ')}${missingFromDB.length > 20 ? '...' : ''}`);
      
      // Analizar las características de las tareas faltantes
      console.log(`\n🔍 ANÁLISIS DE TAREAS FALTANTES:`);
      
      missingFromDB.slice(0, 10).forEach(missingCode => {
        const excelRows = validRows.filter(row => parseInt(row[9]) === missingCode);
        if (excelRows.length > 0) {
          const row = excelRows[0];
          console.log(`\nCódigo ${missingCode}:`);
          console.log(`  - Tema: "${row[6]}"`);
          console.log(`  - Proyecto: "${row[1]}"`);
          console.log(`  - Objetivo: "${row[10] || 'vacío'}"`);
          console.log(`  - Instrumento: "${row[11] || 'vacío'}"`);
          console.log(`  - Propuesta: "${row[7] ? row[7].substring(0, 100) + '...' : 'vacío'}"`);
          console.log(`  - Respuesta: "${row[8] ? row[8].substring(0, 100) + '...' : 'vacío'}"`);
        }
      });
    }
    
    // Encontrar códigos que están en BD pero NO en Excel
    const missingFromExcel = dbCodes.filter(code => !excelCodes.includes(code));
    console.log(`\n❓ CÓDIGOS EN BD PERO NO EN EXCEL (${missingFromExcel.length}):`);
    if (missingFromExcel.length > 0) {
      console.log(`Códigos: ${missingFromExcel.slice(0, 20).join(', ')}${missingFromExcel.length > 20 ? '...' : ''}`);
    }
    
    // Analizar patrones en las tareas importadas exitosamente
    console.log(`\n✅ ANÁLISIS DE TAREAS IMPORTADAS EXITOSAMENTE:`);
    
    const importedCodes = excelCodes.filter(code => dbCodes.includes(code));
    console.log(`Tareas importadas correctamente: ${importedCodes.length}`);
    
    // Analizar características de las tareas importadas vs no importadas
    const importedRows = validRows.filter(row => dbCodes.includes(parseInt(row[9])));
    const notImportedRows = validRows.filter(row => missingFromDB.includes(parseInt(row[9])));
    
    console.log(`\n📊 COMPARACIÓN DE CARACTERÍSTICAS:`);
    
    // Proyectos en tareas importadas
    const importedProjects = [...new Set(importedRows.map(row => row[1]))];
    const notImportedProjects = [...new Set(notImportedRows.map(row => row[1]))];
    
    console.log(`\nProyectos en tareas IMPORTADAS: ${importedProjects.join(', ')}`);
    console.log(`Proyectos en tareas NO IMPORTADAS: ${notImportedProjects.join(', ')}`);
    
    // Verificar si hay patrones en las columnas vacías
    console.log(`\n🔍 ANÁLISIS DE COLUMNAS VACÍAS:`);
    
    const importedEmptyObjective = importedRows.filter(row => !row[10] || row[10].trim() === '').length;
    const notImportedEmptyObjective = notImportedRows.filter(row => !row[10] || row[10].trim() === '').length;
    
    const importedEmptyInstrument = importedRows.filter(row => !row[11] || row[11].trim() === '').length;
    const notImportedEmptyInstrument = notImportedRows.filter(row => !row[11] || row[11].trim() === '').length;
    
    console.log(`Tareas importadas con Objetivo vacío: ${importedEmptyObjective}/${importedRows.length}`);
    console.log(`Tareas NO importadas con Objetivo vacío: ${notImportedEmptyObjective}/${notImportedRows.length}`);
    console.log(`Tareas importadas con Instrumento vacío: ${importedEmptyInstrument}/${importedRows.length}`);
    console.log(`Tareas NO importadas con Instrumento vacío: ${notImportedEmptyInstrument}/${notImportedRows.length}`);
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

detailedImportAnalysis();