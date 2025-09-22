// Test simplificado para debuggear específicamente la creación de tareas
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testTaskCreation() {
  console.log('🧪 TEST DIRECTO DE CREACIÓN DE TAREAS...\n');
  
  try {
    // Datos de prueba simples
    const testTaskData = {
      name: 'TAREA_DEBUG_DIRECTO',
      description: 'Prueba directa desde script',
      status: 'pending',
      startDate: '2025-07-20',
      dueDate: '2025-07-20', 
      endDate: '2025-07-20',
      projectId: 149, // DLLO.RED existe en la base de datos
      subgroupId: null,
      order: 0,
      userId: 7, // Usuario Jaimepc
      code: '995',
      priority: 'media'
    };
    
    console.log('📝 Datos de tarea a insertar:', JSON.stringify(testTaskData, null, 2));
    
    // Insertar directamente usando SQL
    const query = `
      INSERT INTO tasks (name, description, status, start_date, due_date, end_date, project_id, subgroup_id, "order", user_id, code, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      testTaskData.name,
      testTaskData.description,
      testTaskData.status,
      testTaskData.startDate,
      testTaskData.dueDate,
      testTaskData.endDate,
      testTaskData.projectId,
      testTaskData.subgroupId,
      testTaskData.order,
      testTaskData.userId,
      testTaskData.code,
      testTaskData.priority
    ];
    
    console.log('🔄 Ejecutando inserción...');
    const result = await sql(query, values);
    
    console.log('✅ Tarea creada exitosamente:', result[0]);
    
    // Verificar que se creó
    const countResult = await sql('SELECT COUNT(*) as total FROM tasks WHERE user_id = $1', [7]);
    console.log(`📊 Total de tareas en la base de datos: ${countResult[0].total}`);
    
  } catch (error) {
    console.error('❌ Error en test de creación:', error);
    console.error('Stack:', error.stack);
  }
}

testTaskCreation().then(() => {
  console.log('\n🎯 Test completado.');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});