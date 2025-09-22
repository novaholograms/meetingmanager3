// Script para hacer una importación de prueba con el archivo del usuario
// y ver exactamente qué errores se producen

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('=== TEST DE IMPORTACIÓN CON ARCHIVO REAL ===\n');

// Buscar el archivo Excel
const attachedDir = './attached_assets';
const files = fs.readdirSync(attachedDir).filter(f => f.includes('.xlsx') && f.includes('temas dani'));
const latestFile = files.sort().pop();
const filePath = path.join(attachedDir, latestFile);

console.log(`🔄 Simulando importación de: ${latestFile}\n`);

try {
  // Leer el archivo con la misma configuración que el sistema real
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

  console.log(`📊 Datos leídos: ${data.length} filas`);
  console.log('Columnas detectadas:', Object.keys(data[0] || {}).join(', '));
  console.log('');

  // Simular contadores como en el sistema real
  const results = {
    totalProcessed: data.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    meetings: 0,
    projects: 0,
    tasks: 0,
    keyPoints: 0,
    proposals: 0
  };

  // Caches para simular el sistema real
  const projectCache = new Map();
  const meetingCache = new Map();
  const keyPointCache = new Map();

  // Procesar cada fila
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 2;
    
    try {
      // Función getColumnValue igual que en el sistema
      const getColumnValue = (row, possibleNames) => {
        for (const name of possibleNames) {
          if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
            return String(row[name]).trim();
          }
        }
        return null;
      };

      // Extraer datos
      const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']);
      const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']);
      const meetingDate = getColumnValue(row, ['Fecha', 'fecha']);
      const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']);
      const proposalText = getColumnValue(row, ['Propuestas', 'propuestas', 'Propuesta']);
      const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);

      // Validar fila vacía
      if (!meetingTitle && !projectName && !keyPointTitle) {
        console.log(`Fila ${rowNum}: Vacía, saltando...`);
        continue;
      }

      // Validar campos requeridos
      if (!meetingTitle || !projectName || !keyPointTitle) {
        const missing = [];
        if (!meetingTitle) missing.push('Título reunión');
        if (!projectName) missing.push('Proyecto');
        if (!keyPointTitle) missing.push('Temas');
        
        results.errorCount++;
        results.errors.push(`Fila ${rowNum}: Campos faltantes: ${missing.join(', ')}`);
        console.log(`❌ Fila ${rowNum}: ERROR - Campos faltantes: ${missing.join(', ')}`);
        continue;
      }

      // Simular creación de proyecto
      if (!projectCache.has(projectName)) {
        projectCache.set(projectName, results.projects + 1);
        results.projects++;
      }

      // Simular creación de reunión
      const meetingKey = `${meetingTitle}-${meetingDate}`;
      if (!meetingCache.has(meetingKey)) {
        meetingCache.set(meetingKey, results.meetings + 1);
        results.meetings++;
      }

      // Simular creación de punto clave
      if (!keyPointCache.has(keyPointTitle)) {
        keyPointCache.set(keyPointTitle, results.keyPoints + 1);
        results.keyPoints++;
      }

      // Simular creación de propuesta
      if (proposalText && proposalText.length > 0) {
        results.proposals++;
      }

      // Simular creación de tarea
      results.tasks++;

      results.successCount++;
      
    } catch (error) {
      console.log(`❌ Fila ${rowNum}: ERROR - ${error.message}`);
      results.errorCount++;
      results.errors.push(`Fila ${rowNum}: ${error.message}`);
    }
  }

  // Mostrar resultados simulados
  console.log('\n📋 RESULTADOS DE LA SIMULACIÓN:');
  console.log(`Total procesadas: ${results.totalProcessed}`);
  console.log(`Exitosas: ${results.successCount}`);
  console.log(`Con errores: ${results.errorCount}`);
  console.log('');
  console.log('🏗️  ELEMENTOS QUE SE CREARÍAN:');
  console.log(`Reuniones: ${results.meetings}`);
  console.log(`Proyectos: ${results.projects}`);
  console.log(`Tareas: ${results.tasks}`);
  console.log(`Puntos clave: ${results.keyPoints}`);
  console.log(`Propuestas: ${results.proposals} ← ¡IMPORTANTE!`);
  console.log('');

  if (results.errors.length > 0) {
    console.log('❌ ERRORES DETECTADOS:');
    results.errors.forEach(error => {
      console.log(`   • ${error}`);
    });
    console.log('');
  }

  // Comparar con los resultados reales que tuvo el usuario
  console.log('🔍 COMPARACIÓN CON RESULTADOS REALES:');
  console.log('REAL vs SIMULADO:');
  console.log(`Reuniones: 52 vs ${results.meetings}`);
  console.log(`Proyectos: 7 vs ${results.projects}`);
  console.log(`Tareas: 327 vs ${results.tasks}`);
  console.log(`Puntos clave: 244 vs ${results.keyPoints}`);
  console.log(`Propuestas: 0 vs ${results.proposals} ← DIFERENCIA CLAVE`);
  console.log(`Errores: 6 vs ${results.errorCount}`);

} catch (error) {
  console.error('❌ Error en la simulación:', error.message);
}