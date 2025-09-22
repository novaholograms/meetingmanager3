const { drizzle } = require('drizzle-orm/node-postgres');
const { Client } = require('pg');
const { tasks } = require('./shared/schema.ts');

async function testTaskCreation() {
  console.log('🧪 Iniciando prueba de creación de tareas...');
  
  // Conectar a la base de datos
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await client.connect();
    const db = drizzle(client);
    
    // Intentar crear una tarea de prueba
    const testTask = {
      name: 'TAREA DE PRUEBA',
      description: 'Descripción de prueba',
      status: 'pending',
      projectId: 142, // Usando un proyecto existente
      userId: 7,      // Usuario existente
      code: '999',
      order: 0
    };
    
    console.log('📝 Datos de tarea de prueba:', JSON.stringify(testTask, null, 2));
    
    const [newTask] = await db
      .insert(tasks)
      .values(testTask)
      .returning();
      
    console.log('✅ Tarea creada exitosamente:', newTask);
    
    // Verificar conteo total
    const result = await db.select().from(tasks);
    console.log(`📊 Total de tareas en la base de datos: ${result.length}`);
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await client.end();
  }
}

testTaskCreation();