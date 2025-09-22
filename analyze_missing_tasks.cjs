const XLSX = require('xlsx');

function analyzeMissingTasks() {
  console.log("🔍 ANÁLISIS DE TAREAS FALTANTES ESPECÍFICAS");
  console.log("===========================================");
  
  try {
    // Leer archivo Excel
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755787410199.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Códigos faltantes identificados
    const missingCodes = [255, 256, 257, 260];
    
    console.log("❌ TAREAS FALTANTES EN BASE DE DATOS:");
    console.log("====================================");
    
    missingCodes.forEach(code => {
      console.log(`\n📌 CÓDIGO ${code}:`);
      
      const excelRows = excelData.slice(1).filter(row => parseInt(row[9]) === code);
      
      if (excelRows.length > 0) {
        const row = excelRows[0];
        console.log(`  ✅ Encontrado en Excel`);
        console.log(`  - Tema: "${row[6] || 'vacío'}"`);
        console.log(`  - Proyecto: "${row[1] || 'vacío'}"`);
        console.log(`  - Objetivo: "${row[10] || 'vacío'}"`);
        console.log(`  - Instrumento: "${row[11] || 'vacío'}"`);
        console.log(`  - Propuesta: "${row[7] ? (row[7].length > 100 ? row[7].substring(0, 100) + '...' : row[7]) : 'vacío'}"`);
        console.log(`  - Respuesta: "${row[8] ? (row[8].length > 100 ? row[8].substring(0, 100) + '...' : row[8]) : 'vacío'}"`);
        console.log(`  - Fecha: "${row[2] || 'vacío'}"`);
        console.log(`  - Hora inicio: "${row[3] || 'vacío'}"`);
        console.log(`  - Hora fin: "${row[4] || 'vacío'}"`);
        console.log(`  - Participantes: "${row[5] || 'vacío'}"`);
        
        // Verificar si algún campo tiene caracteres especiales o problemas
        const problematicFields = [];
        if (row[6] && /[^\x00-\x7F]/.test(row[6])) problematicFields.push("tema");
        if (row[1] && /[^\x00-\x7F]/.test(row[1])) problematicFields.push("proyecto");
        if (row[10] && /[^\x00-\x7F]/.test(row[10])) problematicFields.push("objetivo");
        if (row[11] && /[^\x00-\x7F]/.test(row[11])) problematicFields.push("instrumento");
        
        if (problematicFields.length > 0) {
          console.log(`  ⚠️  Caracteres especiales en: ${problematicFields.join(', ')}`);
        }
        
        // Verificar longitud de campos
        const longFields = [];
        if (row[6] && row[6].length > 200) longFields.push(`tema (${row[6].length} chars)`);
        if (row[7] && row[7].length > 1000) longFields.push(`propuesta (${row[7].length} chars)`);
        if (row[8] && row[8].length > 1000) longFields.push(`respuesta (${row[8].length} chars)`);
        
        if (longFields.length > 0) {
          console.log(`  📏 Campos largos: ${longFields.join(', ')}`);
        }
        
      } else {
        console.log(`  ❌ NO encontrado en Excel`);
      }
    });
    
    // Comparar con tareas que SÍ se importaron (258, 259)
    console.log("\n\n✅ TAREAS IMPORTADAS EXITOSAMENTE (para comparación):");
    console.log("===================================================");
    
    const importedCodes = [258, 259];
    
    importedCodes.forEach(code => {
      console.log(`\n📌 CÓDIGO ${code} (IMPORTADO):`);
      
      const excelRows = excelData.slice(1).filter(row => parseInt(row[9]) === code);
      
      if (excelRows.length > 0) {
        const row = excelRows[0];
        console.log(`  - Tema: "${row[6] || 'vacío'}"`);
        console.log(`  - Proyecto: "${row[1] || 'vacío'}"`);
        console.log(`  - Objetivo: "${row[10] || 'vacío'}"`);
        console.log(`  - Instrumento: "${row[11] || 'vacío'}"`);
        console.log(`  - Fecha: "${row[2] || 'vacío'}"`);
        console.log(`  - Participantes: "${row[5] || 'vacío'}"`);
      }
    });
    
    // Analizar diferencias estructurales
    console.log("\n\n🔍 ANÁLISIS COMPARATIVO:");
    console.log("========================");
    
    const missingRows = excelData.slice(1).filter(row => missingCodes.includes(parseInt(row[9])));
    const importedRows = excelData.slice(1).filter(row => importedCodes.includes(parseInt(row[9])));
    
    console.log(`\nCaracterísticas de tareas FALTANTES:`);
    console.log(`- Proyectos: ${[...new Set(missingRows.map(r => r[1]))].join(', ')}`);
    console.log(`- Objetivos: ${[...new Set(missingRows.map(r => r[10]))].join(', ')}`);
    console.log(`- Instrumentos: ${[...new Set(missingRows.map(r => r[11]))].join(', ')}`);
    
    console.log(`\nCaracterísticas de tareas IMPORTADAS:`);
    console.log(`- Proyectos: ${[...new Set(importedRows.map(r => r[1]))].join(', ')}`);
    console.log(`- Objetivos: ${[...new Set(importedRows.map(r => r[10]))].join(', ')}`);
    console.log(`- Instrumentos: ${[...new Set(importedRows.map(r => r[11]))].join(', ')}`);
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

analyzeMissingTasks();