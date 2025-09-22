const XLSX = require('xlsx');

function debugImportErrors() {
  console.log("🔍 DEBUG: ANÁLISIS DE ERRORES DE IMPORTACIÓN");
  console.log("============================================");
  
  try {
    // Leer archivo Excel
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755787410199.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Códigos problemáticos
    const problematicCodes = [255, 256, 257, 260];
    
    console.log("❌ ANÁLISIS DETALLADO DE VALIDACIÓN:");
    console.log("===================================");
    
    // Función para obtener valor de columna igual que en el importador
    const getColumnValue = (row, possibleNames) => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
          return row[name];
        }
      }
      return null;
    };
    
    data.slice(1).forEach((row, index) => {
      const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);
      
      if (problematicCodes.includes(parseInt(taskCode))) {
        console.log(`\n📌 FILA ${index + 2} - CÓDIGO ${taskCode}:`);
        
        // Extraer datos EXACTAMENTE como en el importador
        const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']);
        const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']);
        const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']);
        const objectiveName = getColumnValue(row, ['Objetivo (nivel 2)', 'Objetivo', 'objetivo']);
        const instrumentName = getColumnValue(row, ['Instrumento (nivel 3)', 'Instrumento', 'instrumento']);
        
        console.log(`  ✓ Título Reunión: "${meetingTitle || 'NULL'}"`);
        console.log(`  ✓ Proyecto: "${projectName || 'NULL'}"`);
        console.log(`  ✓ Tema: "${keyPointTitle || 'NULL'}"`);
        console.log(`  ✓ Objetivo: "${objectiveName || 'NULL'}"`);
        console.log(`  ✓ Instrumento: "${instrumentName || 'NULL'}"`);
        
        // VALIDACIÓN CRÍTICA (igual que líneas 304-316 del importador)
        const validationPassed = !!(meetingTitle && projectName && keyPointTitle);
        console.log(`  🎯 VALIDACIÓN: ${validationPassed ? '✅ PASA' : '❌ FALLA'}`);
        
        if (!validationPassed) {
          const missingFields = [];
          if (!meetingTitle) missingFields.push('Título Reunión');
          if (!projectName) missingFields.push('Proyecto');
          if (!keyPointTitle) missingFields.push('Tema');
          console.log(`  ❌ CAMPOS FALTANTES: ${missingFields.join(', ')}`);
          console.log(`  ⚠️  Esta fila será saltada por el importador`);
        }
        
        // Mostrar todos los campos de la fila para debug
        console.log(`  📋 COLUMNAS DISPONIBLES: ${Object.keys(row).join(', ')}`);
        console.log(`  📊 VALORES RAW:`);
        Object.keys(row).forEach(key => {
          if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
            console.log(`    ${key}: "${row[key]}"`);
          }
        });
      }
    });
    
    // Verificar también algunas filas que SÍ se importaron para comparación
    console.log("\n\n✅ COMPARACIÓN CON TAREAS IMPORTADAS:");
    console.log("====================================");
    
    const workingCodes = [258, 259]; // Códigos que sabemos que funcionan
    
    data.slice(1).forEach((row, index) => {
      const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);
      
      if (workingCodes.includes(parseInt(taskCode))) {
        console.log(`\n📌 FILA ${index + 2} - CÓDIGO ${taskCode} (IMPORTADO):`);
        
        const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']);
        const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']);
        const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']);
        
        console.log(`  ✓ Título Reunión: "${meetingTitle || 'NULL'}"`);
        console.log(`  ✓ Proyecto: "${projectName || 'NULL'}"`);
        console.log(`  ✓ Tema: "${keyPointTitle || 'NULL'}"`);
        
        const validationPassed = !!(meetingTitle && projectName && keyPointTitle);
        console.log(`  🎯 VALIDACIÓN: ${validationPassed ? '✅ PASA' : '❌ FALLA'}`);
      }
    });
    
  } catch (error) {
    console.error("❌ Error en debug:", error.message);
  }
}

debugImportErrors();