// Test directo que simula exactamente el comportamiento del importador
const xlsx = require('xlsx');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testImportSimulation() {
  console.log('🧪 TEST SIMULACIÓN DIRECTA DEL IMPORTADOR...\n');
  
  try {
    // Leer el archivo Excel de prueba
    const workbook = xlsx.readFile('./test_import_single_row.xlsx', {
      cellDates: true,
      dateNF: 'dd/mm/yyyy',
      cellFormula: false,
      cellStyles: false,
    });
    
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet, {
      defval: null,
      raw: false
    });
    
    console.log('📊 Datos leídos del Excel:', data.length, 'filas');
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      console.log(`\n=== PROCESANDO FILA ${i + 1} ===`);
      
      // Función para buscar columna (igual que en el importador)
      const getColumnValue = (row, possibleNames) => {
        for (const name of possibleNames) {
          if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
            return row[name];
          }
        }
        return null;
      };

      // Extraer datos exactamente igual que el importador
      const meetingTitle = getColumnValue(row, ['Título Reunión', 'Titulo Reunion', 'titulo reunion', 'Título Reunion']);
      const projectName = getColumnValue(row, ['Proyecto/Comité', 'Proyecto/Comite', 'proyecto/comité', 'Proyecto']);
      const meetingDate = getColumnValue(row, ['Fecha', 'fecha']);
      const startTime = getColumnValue(row, ['Hora Inicio', 'Hora inicio', 'hora inicio']);
      const endTime = getColumnValue(row, ['Hora Fin', 'Hora fin', 'hora fin']);
      const participants = getColumnValue(row, ['Participantes', 'participantes']);
      const keyPointTitle = getColumnValue(row, ['Temas (nivel 4)', 'Temas/Puntos Clave', 'Temas', 'temas']);
      const proposalText = getColumnValue(row, ['Propuestas', 'propuestas', 'Propuesta']);
      const responseText = getColumnValue(row, ['Respuesta', 'respuesta']);
      const taskCode = getColumnValue(row, ['Código', 'Codigo', 'codigo', 'Code']);
      const objectiveName = getColumnValue(row, ['Objetivo (nivel 2)', 'Objetivo', 'objetivo']);
      const instrumentName = getColumnValue(row, ['Instrumento (nivel 3)', 'Instrumento', 'instrumento']);

      console.log('🔍 DATOS EXTRAÍDOS:');
      console.log(`  meetingTitle: "${meetingTitle}"`);
      console.log(`  projectName: "${projectName}"`);
      console.log(`  keyPointTitle: "${keyPointTitle}"`);
      console.log(`  taskCode: "${taskCode}"`);
      console.log(`  objectiveName: "${objectiveName}"`);
      console.log(`  instrumentName: "${instrumentName}"`);

      // Validaciones del importador
      if (!meetingTitle && !projectName && !keyPointTitle) {
        console.log(`❌ Fila ${i + 1} vacía, saltando...`);
        continue;
      }
      
      if (!meetingTitle || !projectName || !keyPointTitle) {
        console.error(`❌ ERROR EN VALIDACIÓN: Faltan campos obligatorios. meeting="${meetingTitle}", project="${projectName}", tema="${keyPointTitle}"`);
        continue;
      }
      
      console.log('✅ VALIDACIÓN INICIAL PASADA');

      // Simular creación de proyecto (asumir que existe)
      let projectId = 149; // DLLO.RED
      console.log(`📁 Proyecto simulado ID: ${projectId}`);

      // Simular creación de reunión (asumir que se crea)
      let meetingId = 999; // Simulado
      console.log(`📅 Reunión simulada ID: ${meetingId}`);

      // PUNTO CRÍTICO: Simular la condición que el importador evalúa para crear tareas
      console.log('\n🎯 EVALUANDO CONDICIÓN PARA CREAR TAREA:');
      console.log(`  projectId: ${projectId} (existe: ${!!projectId})`);
      console.log(`  keyPointTitle: "${keyPointTitle}" (existe: ${!!keyPointTitle})`);
      console.log(`  Condición (projectId && keyPointTitle): ${!!(projectId && keyPointTitle)}`);

      if (projectId && keyPointTitle) {
        console.log('✅ INICIANDO CREACIÓN DE TAREA...');
        
        // Procesar código de tarea
        console.log('🔢 PROCESANDO CÓDIGO DE TAREA:');
        console.log(`  taskCode original: "${taskCode}"`);
        console.log(`  taskCode tipo: ${typeof taskCode}`);
        
        let processedTaskCode = null;
        if (taskCode) {
          const codeStr = String(taskCode).trim();
          console.log(`  codeStr después de trim: "${codeStr}"`);
          console.log(`  Regex test (/^\\d+$/): ${codeStr.match(/^\d+$/)}`);
          
          if (codeStr.match(/^\d+$/)) {
            processedTaskCode = codeStr.padStart(3, '0');
            console.log(`  ✅ Código procesado: "${processedTaskCode}"`);
          } else {
            console.log(`  ❌ Código no válido: "${codeStr}"`);
          }
        } else {
          console.log('  ⚠️ No hay código de tarea');
        }

        // Procesar fecha
        const parsedDate = meetingDate || new Date().toISOString().split('T')[0];
        console.log(`📅 Fecha procesada: ${parsedDate}`);

        // Crear datos de tarea
        const newTask = {
          name: String(keyPointTitle).trim(),
          description: proposalText ? String(proposalText).trim() : null,
          status: 'pending',
          startDate: parsedDate,
          dueDate: parsedDate,
          endDate: parsedDate,
          projectId: projectId,
          subgroupId: null,
          order: 0,
          userId: 7,
          code: processedTaskCode,
        };
        
        console.log('📝 Datos de tarea a insertar:', JSON.stringify(newTask, null, 2));
        
        // Intentar crear la tarea directamente
        try {
          const query = `
            INSERT INTO tasks (name, description, status, start_date, due_date, end_date, project_id, subgroup_id, "order", user_id, code)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
          `;
          
          const values = [
            newTask.name,
            newTask.description,
            newTask.status,
            newTask.startDate,
            newTask.dueDate,
            newTask.endDate,
            newTask.projectId,
            newTask.subgroupId,
            newTask.order,
            newTask.userId,
            newTask.code
          ];
          
          console.log('🔄 Ejecutando inserción de tarea...');
          const result = await sql(query, values);
          
          console.log('✅ TAREA CREADA EXITOSAMENTE:', result[0]);
          
        } catch (taskError) {
          console.error('❌ ERROR AL CREAR TAREA:', taskError);
          throw taskError;
        }
        
      } else {
        console.log('❌ NO SE PUEDE CREAR TAREA:');
        console.log(`  - projectId falta: ${!projectId}`);
        console.log(`  - keyPointTitle falta: ${!keyPointTitle}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en test:', error);
    console.error('Stack:', error.stack);
  }
}

testImportSimulation().then(() => {
  console.log('\n🎯 Test de simulación completado.');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});