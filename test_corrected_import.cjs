const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testCorrectedImport() {
  console.log("🧪 PRUEBA DE IMPORTACIÓN CON CORRECCIÓN");
  console.log("=====================================");
  
  try {
    // Verificar conteo ANTES de la importación
    console.log("📊 CONTEO ANTES:");
    const tasksBefore = await fetch('http://localhost:5000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=s%3Ad9c16c0b-33f4-4bdc-ba3b-e87a9b6a1eb3.hs%2FtmpCOPy9kD5Xpe%2FwShyQTKu70F2yR0QLMaJdXw' // Cookie de sesión del usuario
      }
    });
    
    if (tasksBefore.ok) {
      const tasks = await tasksBefore.json();
      console.log(`  Tareas en BD: ${tasks.length}`);
      
      // Verificar códigos específicos
      const problematicCodes = [255, 256, 257, 260];
      const foundCodes = tasks.filter(t => problematicCodes.includes(parseInt(t.code))).map(t => t.code);
      console.log(`  Códigos problemáticos encontrados: [${foundCodes.join(', ')}]`);
      console.log(`  Códigos faltantes: [${problematicCodes.filter(c => !foundCodes.includes(c.toString())).join(', ')}]`);
    }
    
    // Preparar archivo para subida
    const form = new FormData();
    form.append('file', fs.createReadStream('attached_assets/temas dani_subido18julio_1755786101446.xlsx'));
    
    console.log("\n🚀 INICIANDO IMPORTACIÓN...");
    const response = await fetch('http://localhost:5000/api/import/unified-excel', {
      method: 'POST',
      body: form,
      headers: {
        'Cookie': 'connect.sid=s%3Ad9c16c0b-33f4-4bdc-ba3b-e87a9b6a1eb3.hs%2FtmpCOPy9kD5Xpe%2FwShyQTKu70F2yR0QLMaJdXw',
        ...form.getHeaders()
      }
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ IMPORTACIÓN COMPLETADA:");
      console.log(`  Total procesadas: ${result.totalProcessed}`);
      console.log(`  Exitosas: ${result.successCount}`);
      console.log(`  Errores: ${result.errorCount}`);
      console.log(`  Tareas: ${result.tasks}`);
      console.log(`  Reuniones: ${result.meetings}`);
      console.log(`  Propuestas: ${result.proposals}`);
      
      if (result.errors && result.errors.length > 0) {
        console.log("\n❌ ERRORES ENCONTRADOS:");
        result.errors.slice(0, 5).forEach(error => console.log(`  - ${error}`));
        if (result.errors.length > 5) {
          console.log(`  ... y ${result.errors.length - 5} errores más`);
        }
      }
    } else {
      const error = await response.text();
      console.error("❌ Error en importación:", error);
    }
    
    // Verificar conteo DESPUÉS de la importación
    console.log("\n📊 VERIFICACIÓN POST-IMPORTACIÓN:");
    const tasksAfter = await fetch('http://localhost:5000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=s%3Ad9c16c0b-33f4-4bdc-ba3b-e87a9b6a1eb3.hs%2FtmpCOPy9kD5Xpe%2FwShyQTKu70F2yR0QLMaJdXw'
      }
    });
    
    if (tasksAfter.ok) {
      const tasks = await tasksAfter.json();
      console.log(`  Tareas en BD: ${tasks.length}`);
      
      // Verificar códigos específicos DESPUÉS
      const problematicCodes = [255, 256, 257, 260];
      const foundCodes = tasks.filter(t => problematicCodes.includes(parseInt(t.code))).map(t => t.code);
      console.log(`  Códigos problemáticos encontrados: [${foundCodes.join(', ')}]`);
      
      const stillMissing = problematicCodes.filter(c => !foundCodes.includes(c.toString()));
      if (stillMissing.length === 0) {
        console.log("🎉 ¡ÉXITO! Todos los códigos problemáticos han sido importados");
      } else {
        console.log(`❌ Códigos aún faltantes: [${stillMissing.join(', ')}]`);
      }
      
      // Mostrar detalles de tareas problemáticas importadas
      const importedProblematicTasks = tasks.filter(t => problematicCodes.includes(parseInt(t.code)));
      if (importedProblematicTasks.length > 0) {
        console.log("\n📝 TAREAS PROBLEMÁTICAS IMPORTADAS:");
        importedProblematicTasks.forEach(task => {
          console.log(`  ${task.code}: "${task.name}" [${task.projectId ? 'con proyecto' : 'sin proyecto'}]`);
        });
      }
    }
    
  } catch (error) {
    console.error("❌ Error en prueba:", error.message);
  }
}

testCorrectedImport();