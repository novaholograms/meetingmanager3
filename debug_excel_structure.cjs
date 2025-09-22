// Debuggear la estructura del archivo Excel para entender el problema de las tareas
const xlsx = require('xlsx');
const fs = require('fs');

console.log('🔍 ANALIZANDO ARCHIVO EXCEL PARA DEBUGGEAR TAREAS...\n');

// Analizar el archivo creado de prueba
if (fs.existsSync('./test_import_single_row.xlsx')) {
  console.log('📁 Analizando test_import_single_row.xlsx:');
  const workbook = xlsx.readFile('./test_import_single_row.xlsx');
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(worksheet, { defval: null, raw: false });
  
  console.log('📊 Datos del archivo de prueba:');
  console.log('   Número de filas:', data.length);
  
  if (data.length > 0) {
    console.log('   Columnas disponibles:', Object.keys(data[0]));
    console.log('   Primera fila completa:', JSON.stringify(data[0], null, 2));
    
    // Simular la función getColumnValue del importador
    const getColumnValue = (row, possibleNames) => {
      for (const name of possibleNames) {
        if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
          return row[name];
        }
      }
      return null;
    };
    
    const row = data[0];
    console.log('\n🔍 SIMULANDO EXTRACCIÓN DE DATOS:');
    const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']);
    const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']);
    const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']);
    const objectiveName = getColumnValue(row, ['Objetivo (nivel 2)', 'Objetivo', 'objetivo']);
    const instrumentName = getColumnValue(row, ['Instrumento (nivel 3)', 'Instrumento', 'instrumento']);
    
    console.log(`   meetingTitle: "${meetingTitle}"`);
    console.log(`   projectName: "${projectName}"`);
    console.log(`   keyPointTitle: "${keyPointTitle}" ← ESTE ES EL NIVEL 4`);
    console.log(`   objectiveName: "${objectiveName}"`);
    console.log(`   instrumentName: "${instrumentName}"`);
    
    console.log('\n✅ CONDICIONES PARA CREAR TAREA:');
    console.log(`   projectName existe: ${!!projectName}`);
    console.log(`   meetingTitle existe: ${!!meetingTitle}`);
    console.log(`   keyPointTitle existe: ${!!keyPointTitle}`);
    console.log(`   Validación inicial (todos requeridos): ${!!(meetingTitle && projectName && keyPointTitle)}`);
    console.log(`   Condición para crear tarea (projectId && keyPointTitle): Se evaluará después de crear proyecto`);
  }
}

// Analizar uno de los archivos Excel reales del usuario
const realFiles = [
  './attached_assets/temas dani_subido18julio_1753004545198.xlsx',
  './attached_assets/temas dani_subido18julio_1753003980335.xlsx',
  './attached_assets/TEMAS DANI (2).xlsx'
];

for (const filePath of realFiles) {
  if (fs.existsSync(filePath)) {
    console.log(`\n📁 Analizando archivo real: ${filePath}`);
    try {
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet, { defval: null, raw: false });
      
      console.log('📊 Datos del archivo real:');
      console.log('   Número de filas:', data.length);
      
      if (data.length > 0) {
        console.log('   Columnas disponibles:', Object.keys(data[0]));
        
        // Buscar filas que contengan datos en nivel 4
        let rowsWithLevel4 = 0;
        let sampleRow = null;
        
        for (let i = 0; i < Math.min(data.length, 10); i++) {
          const row = data[i];
          // Buscar columna de temas (nivel 4)
          const temasValue = row['Temas (nivel 4)'] || row['Temas'] || row['temas'] || row['Temas/Puntos Clave'];
          if (temasValue && String(temasValue).trim() !== '') {
            rowsWithLevel4++;
            if (!sampleRow) sampleRow = { index: i, row: row, temas: temasValue };
          }
        }
        
        console.log(`   Filas con datos en nivel 4 (primeras 10): ${rowsWithLevel4}`);
        
        if (sampleRow) {
          console.log(`\n📝 EJEMPLO DE FILA ${sampleRow.index + 1} CON NIVEL 4:`);
          console.log(`   Temas (nivel 4): "${sampleRow.temas}"`);
          console.log(`   Título Reunión: "${sampleRow.row['Título Reunión'] || 'N/A'}"`);
          console.log(`   Proyecto/Comité: "${sampleRow.row['Proyecto/Comité'] || 'N/A'}"`);
          console.log(`   Objetivo (nivel 2): "${sampleRow.row['Objetivo (nivel 2)'] || 'N/A'}"`);
          console.log(`   Instrumento (nivel 3): "${sampleRow.row['Instrumento (nivel 3)'] || 'N/A'}"`);
        }
      }
    } catch (error) {
      console.log(`   ❌ Error al leer archivo: ${error.message}`);
    }
    break; // Solo analizar el primero que encuentre
  }
}

console.log('\n🎯 CONCLUSIÓN:');
console.log('Si el keyPointTitle (Temas nivel 4) existe pero no se crean tareas,');
console.log('el problema está en la lógica del importador, no en la estructura del Excel.');