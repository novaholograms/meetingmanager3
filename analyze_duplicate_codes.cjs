const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('=== ANÁLISIS DE CÓDIGOS DUPLICADOS ===\n');

// Buscar el archivo Excel más reciente
const attachedDir = './attached_assets';
const files = fs.readdirSync(attachedDir).filter(f => f.includes('.xlsx') && f.includes('temas dani'));
const latestFile = files.sort().pop();
const filePath = path.join(attachedDir, latestFile);

console.log(`📁 Analizando códigos duplicados en: ${latestFile}\n`);

try {
  // Leer el archivo Excel
  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
    dateNF: 'dd/mm/yyyy',
    cellFormula: false,
    cellStyles: false,
  });

  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, {
    defval: null,
    raw: false
  });

  console.log(`📊 Total de filas: ${data.length}\n`);

  // Función para obtener valores de columnas
  const getColumnValue = (row, possibleNames) => {
    for (const name of possibleNames) {
      if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
        return String(row[name]).trim();
      }
    }
    return null;
  };

  // Mapear códigos y sus apariciones
  const codeMap = new Map();
  const codeDetails = [];

  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 porque Excel empieza en 1 y tiene header
    
    const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);
    const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion']);
    const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite']);
    const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas']);
    
    if (taskCode) {
      if (!codeMap.has(taskCode)) {
        codeMap.set(taskCode, []);
      }
      
      const occurrence = {
        row: rowNum,
        code: taskCode,
        meeting: meetingTitle || '[SIN TÍTULO]',
        project: projectName || '[SIN PROYECTO]',
        theme: keyPointTitle || '[SIN TEMA]'
      };
      
      codeMap.get(taskCode).push(occurrence);
      codeDetails.push(occurrence);
    }
  });

  // Identificar códigos duplicados
  const duplicatedCodes = [];
  codeMap.forEach((occurrences, code) => {
    if (occurrences.length > 1) {
      duplicatedCodes.push({
        code: code,
        count: occurrences.length,
        occurrences: occurrences
      });
    }
  });

  // Mostrar estadísticas
  console.log('📊 ESTADÍSTICAS DE CÓDIGOS:');
  console.log(`   Total de códigos únicos: ${codeMap.size}`);
  console.log(`   Total de filas con código: ${codeDetails.length}`);
  console.log(`   Códigos duplicados: ${duplicatedCodes.length}`);
  console.log('');

  // Mostrar códigos duplicados detallados
  if (duplicatedCodes.length > 0) {
    console.log('🔄 CÓDIGOS DUPLICADOS ENCONTRADOS:\n');
    
    duplicatedCodes.sort((a, b) => parseInt(a.code) - parseInt(b.code));
    
    duplicatedCodes.forEach((duplicate, index) => {
      console.log(`❌ CÓDIGO ${duplicate.code} (${duplicate.count} apariciones):`);
      
      duplicate.occurrences.forEach((occurrence, occIndex) => {
        console.log(`   ${occIndex + 1}. Fila ${occurrence.row}:`);
        console.log(`      📋 Reunión: ${occurrence.meeting}`);
        console.log(`      🏢 Proyecto: ${occurrence.project}`);
        console.log(`      📝 Tema: ${occurrence.theme}`);
      });
      
      console.log('');
      if (index >= 4) { // Limitar output para los primeros 5 códigos duplicados
        console.log(`... y ${duplicatedCodes.length - 5} códigos duplicados más\n`);
        return; // Salir del forEach
      }
    });
  }

  // Análisis de impacto
  console.log('📋 ANÁLISIS DE IMPACTO EN LA IMPORTACIÓN:\n');
  
  console.log('🔍 ¿CÓMO AFECTA AL SISTEMA?');
  console.log('1. CREACIÓN DE TAREAS:');
  console.log('   • Cada fila intentará crear una tarea con su código');
  console.log('   • Si el código ya existe, puede causar error de clave duplicada');
  console.log('   • O puede sobreescribir la tarea existente');
  console.log('');
  
  console.log('2. ASOCIACIONES CON REUNIONES:');
  console.log('   • Mismo tema/código se discute en múltiples reuniones');
  console.log('   • Una tarea puede estar asociada a varias reuniones');
  console.log('   • Esto puede ser válido si el tema se trata en varios meetings');
  console.log('');
  
  console.log('3. PROPUESTAS Y RESPUESTAS:');
  console.log('   • Cada fila puede generar propuestas diferentes para el mismo código');
  console.log('   • Una tarea puede tener múltiples propuestas de diferentes reuniones');
  console.log('   • Esto enriquece el contexto del tema');
  console.log('');

  // Recomendaciones específicas
  console.log('🎯 RECOMENDACIONES DE GESTIÓN:\n');
  
  console.log('OPCIÓN 1 - MANTENER CÓDIGOS DUPLICADOS (RECOMENDADO):');
  console.log('✅ Permite que un tema se trate en múltiples reuniones');
  console.log('✅ Una tarea puede tener varias propuestas de diferentes contextos');
  console.log('✅ Refleja la realidad: temas recurrentes en diferentes meetings');
  console.log('⚠️  Requiere lógica de fusión/agrupación en el sistema');
  console.log('');
  
  console.log('OPCIÓN 2 - GENERAR CÓDIGOS ÚNICOS:');
  console.log('⚠️  Crear subcódigos: 002-1, 002-2, 002-3 para cada aparición');
  console.log('⚠️  Perdería la conexión conceptual entre apariciones del mismo tema');
  console.log('❌ No refleja que es el mismo tema discutido en diferentes contextos');
  console.log('');

  console.log('OPCIÓN 3 - FUSIONAR FILAS CON MISMO CÓDIGO:');
  console.log('⚠️  Combinar propuestas y respuestas en una sola entrada');
  console.log('❌ Perdería el contexto específico de cada reunión');
  console.log('❌ Perdería la trazabilidad temporal');
  console.log('');

  // Mostrar ejemplos específicos
  if (duplicatedCodes.length > 0) {
    const ejemplo = duplicatedCodes[0];
    console.log(`💡 EJEMPLO PRÁCTICO - CÓDIGO ${ejemplo.code}:`);
    console.log('   Este tema se trata en múltiples contextos:');
    ejemplo.occurrences.forEach((occ, i) => {
      console.log(`   ${i + 1}. ${occ.meeting} (${occ.project})`);
    });
    console.log('   ➡️  Cada contexto puede aportar diferentes perspectivas del mismo tema');
    console.log('');
  }

} catch (error) {
  console.error('❌ Error al procesar el archivo:', error.message);
}