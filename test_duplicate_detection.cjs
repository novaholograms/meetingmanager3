const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testDuplicateDetection() {
  console.log("🧪 PRUEBA DETECCIÓN INTELIGENTE DE DUPLICADOS");
  console.log("============================================");
  
  try {
    // 1. ESTADO INICIAL: Verificar conteo ANTES de la importación
    console.log("📊 PASO 1: ESTADO INICIAL");
    const tasksBefore = await fetch('http://localhost:5000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=s%3Ad9c16c0b-33f4-4bdc-ba3b-e87a9b6a1eb3.hs%2FtmpCOPy9kD5Xpe%2FwShyQTKu70F2yR0QLMaJdXw'
      }
    });
    
    if (!tasksBefore.ok) {
      throw new Error("No se pudo obtener tareas iniciales");
    }
    
    const initialTasks = await tasksBefore.json();
    console.log(`  Total tareas ANTES: ${initialTasks.length}`);
    
    // Verificar códigos específicos problemáticos
    const problematicCodes = [255, 256, 257, 260];
    const foundCodesBefore = initialTasks.filter(t => problematicCodes.includes(parseInt(t.code))).map(t => t.code);
    console.log(`  Códigos problemáticos ANTES: [${foundCodesBefore.join(', ')}]`);
    console.log(`  Códigos faltantes ANTES: [${problematicCodes.filter(c => !foundCodesBefore.includes(c.toString())).join(', ')}]`);
    
    // Mostrar algunos códigos existentes para confirmar detección
    const existingCodes = initialTasks.map(t => t.code).filter(c => c && parseInt(c) >= 250).sort((a, b) => parseInt(a) - parseInt(b));
    console.log(`  Códigos altos existentes: [${existingCodes.slice(0, 10).join(', ')}...]`);
    
    // 2. IMPORTACIÓN: Ejecutar importación
    console.log("\n📥 PASO 2: EJECUTANDO IMPORTACIÓN");
    const form = new FormData();
    form.append('file', fs.createReadStream('attached_assets/temas dani_subido18julio_1755786101446.xlsx'));
    
    const importResponse = await fetch('http://localhost:5000/api/import/unified-excel', {
      method: 'POST',
      body: form,
      headers: {
        'Cookie': 'connect.sid=s%3Ad9c16c0b-33f4-4bdc-ba3b-e87a9b6a1eb3.hs%2FtmpCOPy9kD5Xpe%2FwShyQTKu70F2yR0QLMaJdXw',
        ...form.getHeaders()
      }
    });
    
    if (!importResponse.ok) {
      const errorText = await importResponse.text();
      throw new Error(`Error en importación: ${errorText}`);
    }
    
    const importResult = await importResponse.json();
    console.log("  ✅ IMPORTACIÓN COMPLETADA:");
    console.log(`    Total procesadas: ${importResult.totalProcessed}`);
    console.log(`    Exitosas: ${importResult.successCount}`);
    console.log(`    Errores: ${importResult.errorCount}`);
    console.log(`    Tareas nuevas: ${importResult.tasks}`);
    
    if (importResult.errors && importResult.errors.length > 0) {
      console.log("    ⚠️ Errores (primeros 3):");
      importResult.errors.slice(0, 3).forEach(error => console.log(`      - ${error}`));
    }
    
    // 3. VERIFICACIÓN POST-IMPORTACIÓN
    console.log("\n📊 PASO 3: VERIFICACIÓN FINAL");
    const tasksAfter = await fetch('http://localhost:5000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': 'connect.sid=s%3Ad9c16c0b-33f4-4bdc-ba3b-e87a9b6a1eb3.hs%2FtmpCOPy9kD5Xpe%2FwShyQTKu70F2yR0QLMaJdXw'
      }
    });
    
    if (!tasksAfter.ok) {
      throw new Error("No se pudo obtener tareas finales");
    }
    
    const finalTasks = await tasksAfter.json();
    console.log(`  Total tareas DESPUÉS: ${finalTasks.length}`);
    console.log(`  Diferencia: +${finalTasks.length - initialTasks.length} tareas`);
    
    // Verificar códigos problemáticos DESPUÉS
    const foundCodesAfter = finalTasks.filter(t => problematicCodes.includes(parseInt(t.code))).map(t => t.code);
    console.log(`  Códigos problemáticos DESPUÉS: [${foundCodesAfter.join(', ')}]`);
    
    const stillMissing = problematicCodes.filter(c => !foundCodesAfter.includes(c.toString()));
    
    // 4. ANÁLISIS DE RESULTADOS
    console.log("\n🎯 PASO 4: ANÁLISIS DE RESULTADOS");
    
    if (stillMissing.length === 0) {
      console.log("  🎉 ¡ÉXITO TOTAL! Todos los códigos problemáticos importados");
    } else {
      console.log(`  ❌ Aún faltan códigos: [${stillMissing.join(', ')}]`);
    }
    
    // Verificar que no se duplicaron tareas existentes
    const tasksAdded = finalTasks.length - initialTasks.length;
    const expectedNewTasks = stillMissing.length; // Solo deberían agregarse las faltantes
    
    if (tasksAdded === expectedNewTasks) {
      console.log("  ✅ DETECCIÓN DE DUPLICADOS CORRECTA: Solo se agregaron tareas nuevas");
    } else if (tasksAdded < expectedNewTasks) {
      console.log("  ⚠️ Se agregaron menos tareas de las esperadas");
    } else {
      console.log("  ❌ POSIBLES DUPLICADOS: Se agregaron más tareas de las esperadas");
      console.log(`    Esperadas: ${expectedNewTasks}, Agregadas: ${tasksAdded}`);
    }
    
    // Mostrar detalles de códigos importados
    if (foundCodesAfter.length > foundCodesBefore.length) {
      const newCodes = foundCodesAfter.filter(code => !foundCodesBefore.includes(code));
      console.log(`  📝 Códigos recién importados: [${newCodes.join(', ')}]`);
      
      // Mostrar detalles de las tareas recién importadas
      const newTasks = finalTasks.filter(t => newCodes.includes(t.code));
      newTasks.forEach(task => {
        console.log(`    ${task.code}: "${task.name}" [Proyecto: ${task.projectId}]`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error en prueba:", error.message);
  }
}

testDuplicateDetection();