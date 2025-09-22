const XLSX = require('xlsx');

function debugImportErrorsDetailed() {
  console.log("🔍 DEBUG: ANÁLISIS EXHAUSTIVO DE ERRORES");
  console.log("=======================================");
  
  try {
    // Usar el archivo que sabemos que contiene los datos
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Total filas: ${data.length}`);
    console.log(`📋 Encabezados: ${data[0] ? data[0].join(', ') : 'No encabezados'}`);
    
    // Códigos problemáticos que faltan en BD
    const problematicCodes = [255, 256, 257, 260];
    
    // Función para obtener valor de columna igual que en el importador
    const getColumnValue = (row, possibleNames) => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
          return row[name];
        }
      }
      return null;
    };
    
    console.log("\n❌ ANÁLISIS DE FILAS PROBLEMÁTICAS:");
    console.log("===================================");
    
    let foundProblematic = 0;
    
    data.slice(1).forEach((row, index) => {
      const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);
      const codeNum = parseInt(taskCode);
      
      if (problematicCodes.includes(codeNum)) {
        foundProblematic++;
        console.log(`\n📌 FILA ${index + 2} - CÓDIGO ${taskCode}:`);
        
        // Extraer datos EXACTAMENTE como en el importador
        const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']);
        const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']);
        const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']);
        const objectiveName = getColumnValue(row, ['Objetivo (nivel 2)', 'Objetivo', 'objetivo']);
        const instrumentName = getColumnValue(row, ['Instrumento (nivel 3)', 'Instrumento', 'instrumento']);
        
        console.log(`  Título Reunión: "${meetingTitle || 'NULL'}"`);
        console.log(`  Proyecto: "${projectName || 'NULL'}"`);
        console.log(`  Tema: "${keyPointTitle || 'NULL'}"`);
        console.log(`  Objetivo: "${objectiveName || 'NULL'}"`);
        console.log(`  Instrumento: "${instrumentName || 'NULL'}"`);
        
        // VALIDACIÓN CRÍTICA
        const validationPassed = !!(meetingTitle && projectName && keyPointTitle);
        console.log(`  🎯 VALIDACIÓN: ${validationPassed ? '✅ PASA' : '❌ FALLA'}`);
        
        if (!validationPassed) {
          const missingFields = [];
          if (!meetingTitle) missingFields.push('Título Reunión');
          if (!projectName) missingFields.push('Proyecto');
          if (!keyPointTitle) missingFields.push('Tema');
          console.log(`  ❌ CAMPOS FALTANTES: ${missingFields.join(', ')}`);
          console.log(`  ⚠️  Esta fila será SALTADA por el importador (líneas 304-316)`);
        } else {
          console.log(`  ✅ Esta fila DEBERÍA importarse. Posible otro error más adelante.`);
        }
        
        // Verificar también si hay problemas con caracteres especiales
        if (instrumentName && /[^\x00-\x7F]/.test(instrumentName)) {
          console.log(`  ⚠️  Caracteres especiales detectados en instrumento`);
        }
      }
    });
    
    console.log(`\n📊 Filas problemáticas encontradas: ${foundProblematic}/${problematicCodes.length}`);
    
    // Buscar todas las filas con códigos en el rango problemático
    console.log("\n🔍 CÓDIGOS EN RANGO 250-260:");
    console.log("============================");
    
    const highCodes = [];
    data.slice(1).forEach((row, index) => {
      const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);
      const codeNum = parseInt(taskCode);
      
      if (codeNum >= 250 && codeNum <= 260) {
        highCodes.push({
          fila: index + 2,
          codigo: codeNum,
          tema: getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']) || 'NULL',
          proyecto: getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']) || 'NULL',
          reunion: getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']) || 'NULL'
        });
      }
    });
    
    highCodes.sort((a, b) => a.codigo - b.codigo);
    
    highCodes.forEach(item => {
      const valid = !!(item.reunion !== 'NULL' && item.proyecto !== 'NULL' && item.tema !== 'NULL');
      console.log(`  ${item.codigo}: ${valid ? '✅' : '❌'} "${item.tema}" [${item.proyecto}]`);
    });
    
  } catch (error) {
    console.error("❌ Error en debug:", error.message);
  }
}

debugImportErrorsDetailed();