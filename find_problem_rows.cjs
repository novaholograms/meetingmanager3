const XLSX = require('xlsx');

function findProblemRows() {
  console.log("🔍 BÚSQUEDA EXHAUSTIVA DE FILAS PROBLEMÁTICAS");
  console.log("=============================================");
  
  try {
    // Usar el archivo que sabemos que contiene los datos
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Usar formato con encabezados para acceso directo por nombre de columna
    const dataWithHeaders = XLSX.utils.sheet_to_json(worksheet, {
      defval: null,
      raw: false
    });
    
    console.log(`📊 Total filas con encabezados: ${dataWithHeaders.length}`);
    console.log(`📋 Encabezados encontrados: ${Object.keys(dataWithHeaders[0] || {}).join(', ')}`);
    
    // Buscar todos los códigos altos (250+)
    const highCodeRows = [];
    
    dataWithHeaders.forEach((row, index) => {
      const code = row['Código'] || row['Codigo'] || row['codigo'] || row['Code'];
      const codeNum = parseInt(code);
      
      if (codeNum >= 250) {
        highCodeRows.push({
          rowIndex: index + 2, // +2 porque empezamos en 0 y hay encabezado
          code: codeNum,
          meetingTitle: row['Título Reunión'] || row['Titulo Reunion'] || null,
          project: row['Proyecto/Comité'] || row['Proyecto/Comite'] || row['Proyecto'] || null,
          theme: row['Temas (nivel 4)'] || row['Temas'] || null,
          objective: row['Objetivo (nivel 2)'] || row['Objetivo'] || null,
          instrument: row['Instrumento (nivel 3)'] || row['Instrumento'] || null,
          proposal: row['Propuestas'] || row['Propuesta'] || null,
          response: row['Respuesta'] || null
        });
      }
    });
    
    console.log(`\n🔍 CÓDIGOS ALTOS ENCONTRADOS (${highCodeRows.length}):`);
    console.log("=====================================");
    
    // Ordenar por código
    highCodeRows.sort((a, b) => a.code - b.code);
    
    highCodeRows.forEach(row => {
      console.log(`\n📌 CÓDIGO ${row.code} (Fila ${row.rowIndex}):`);
      console.log(`  Reunión: "${row.meetingTitle || 'NULL'}"`);
      console.log(`  Proyecto: "${row.project || 'NULL'}"`);
      console.log(`  Tema: "${row.theme || 'NULL'}"`);
      console.log(`  Objetivo: "${row.objective || 'NULL'}"`);
      console.log(`  Instrumento: "${row.instrument || 'NULL'}"`);
      
      // Validación crítica del importador
      const isValid = !!(row.meetingTitle && row.project && row.theme);
      console.log(`  🎯 VÁLIDO: ${isValid ? '✅ SÍ' : '❌ NO'}`);
      
      if (!isValid) {
        const missing = [];
        if (!row.meetingTitle) missing.push('Reunión');
        if (!row.project) missing.push('Proyecto');
        if (!row.theme) missing.push('Tema');
        console.log(`  ❌ FALTA: ${missing.join(', ')}`);
      }
      
      // Verificar si está en la lista de códigos problemáticos
      const isProblematic = [255, 256, 257, 260].includes(row.code);
      console.log(`  📊 STATUS: ${isProblematic ? '❌ FALTA EN BD' : '✅ EN BD'}`);
    });
    
    // Analizar códigos faltantes en secuencia
    console.log(`\n🔍 ANÁLISIS DE SECUENCIA:`);
    console.log("========================");
    
    const allCodes = highCodeRows.map(r => r.code).sort((a, b) => a - b);
    const minCode = Math.min(...allCodes);
    const maxCode = Math.max(...allCodes);
    
    console.log(`Rango: ${minCode} - ${maxCode}`);
    
    const missingInSequence = [];
    for (let i = minCode; i <= maxCode; i++) {
      if (!allCodes.includes(i)) {
        missingInSequence.push(i);
      }
    }
    
    if (missingInSequence.length > 0) {
      console.log(`Códigos faltantes en secuencia: ${missingInSequence.join(', ')}`);
    } else {
      console.log(`✅ Secuencia completa`);
    }
    
    // Verificar específicamente los códigos problemáticos
    console.log(`\n🎯 VERIFICACIÓN DE CÓDIGOS PROBLEMÁTICOS:`);
    console.log("========================================");
    
    const problematicCodes = [255, 256, 257, 260];
    problematicCodes.forEach(code => {
      const found = highCodeRows.find(r => r.code === code);
      if (found) {
        console.log(`✅ Código ${code}: ENCONTRADO en Excel - ${found.isValid ? 'Válido' : 'Inválido'}`);
      } else {
        console.log(`❌ Código ${code}: NO ENCONTRADO en Excel`);
      }
    });
    
  } catch (error) {
    console.error("❌ Error en búsqueda:", error.message);
  }
}

findProblemRows();