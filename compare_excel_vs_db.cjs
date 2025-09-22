const XLSX = require('xlsx');

function compareExcelVsDB() {
  console.log("🔍 COMPARANDO EXCEL VS BASE DE DATOS");
  console.log("====================================");
  
  try {
    // Leer archivo Excel
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Filtrar filas válidas (excluyendo encabezado)
    const validRows = excelData.slice(1).filter(row => 
      row[6] && row[9] && // Tiene tema (G) y código (J)
      !isNaN(parseInt(row[9])) // El código es numérico
    );
    
    console.log(`📊 Filas válidas en Excel: ${validRows.length}`);
    
    // Analizar los primeros 10 códigos del Excel
    console.log("\n📋 PRIMEROS 10 TEMAS EN EXCEL:");
    validRows.slice(0, 10).forEach(row => {
      const codigo = row[9]; // Columna J
      const tema = row[6];   // Columna G
      const proyecto = row[1]; // Columna B
      
      console.log(`  Código ${codigo}: "${tema}" [Proyecto: ${proyecto}]`);
    });
    
    // Tareas conocidas en BD (basado en consulta anterior)
    const tasksInDB = [
      { code: "1", name: "Conocer La Estrategia De Tes", project: "DLLO.RED" },
      { code: "2", name: "Reducir Aportaciones Red", project: "VN-VO-FLOTAS" },
      { code: "3", name: "Nuevas Condiciones 2024", project: "VN-VO-FLOTAS" },
      { code: "4", name: "Mejora Condiciones Tfs", project: "TFS" },
      { code: "5", name: "Mantener Condiciones Anteriores", project: "TFS" },
      { code: "6", name: "Mantener Condiciones Anteriores", project: "POSTVENTA" },
      { code: "7", name: "Disponer De Info De Clientes", project: "TIS" },
      { code: "8", name: "Ampliar Alternativas Al Importe De Franquicia De Los Vs Kinto", project: "POSTVENTA" },
      { code: "9", name: "Crear Protocolo De Informacion Online Con La Dgt", project: "TIS" },
      { code: "10", name: "Desarrollar Todas Las Mejoras", project: "PROCESOS-TOSHIKO" }
    ];
    
    console.log("\n💾 PRIMERAS 10 TAREAS EN BD:");
    tasksInDB.forEach(task => {
      console.log(`  Código ${task.code}: "${task.name}" [Proyecto: ${task.project}]`);
    });
    
    // Comparar coincidencias
    console.log("\n🔍 ANÁLISIS DE COINCIDENCIAS:");
    
    const first10Excel = validRows.slice(0, 10);
    let matches = 0;
    let mismatches = [];
    
    first10Excel.forEach((excelRow, index) => {
      const excelCode = excelRow[9];
      const excelTema = excelRow[6];
      const excelProyecto = excelRow[1];
      
      const dbTask = tasksInDB.find(task => task.code === String(excelCode));
      
      if (dbTask) {
        const nameMatch = dbTask.name.toLowerCase().includes(excelTema.toLowerCase()) || 
                         excelTema.toLowerCase().includes(dbTask.name.toLowerCase());
        
        if (nameMatch) {
          matches++;
          console.log(`  ✅ Código ${excelCode}: COINCIDE`);
        } else {
          mismatches.push({
            code: excelCode,
            excelName: excelTema,
            dbName: dbTask.name,
            excelProject: excelProyecto,
            dbProject: dbTask.project
          });
          console.log(`  ❌ Código ${excelCode}: NOMBRE DIFERENTE`);
          console.log(`      Excel: "${excelTema}"`);
          console.log(`      BD: "${dbTask.name}"`);
        }
      } else {
        console.log(`  ❓ Código ${excelCode}: NO ENCONTRADO EN BD`);
      }
    });
    
    console.log(`\n📊 RESUMEN:`);
    console.log(`  - Coincidencias: ${matches}/10`);
    console.log(`  - Diferencias de nombre: ${mismatches.length}`);
    
    // Analizar todos los códigos únicos en Excel
    const allCodes = [...new Set(validRows.map(row => parseInt(row[9])).filter(code => !isNaN(code)))].sort((a, b) => a - b);
    console.log(`\n🔢 CÓDIGOS EN EXCEL:`);
    console.log(`  - Total códigos únicos: ${allCodes.length}`);
    console.log(`  - Rango: ${Math.min(...allCodes)} - ${Math.max(...allCodes)}`);
    
    // Códigos que faltan en secuencia
    const missingInSequence = [];
    for (let i = Math.min(...allCodes); i <= Math.max(...allCodes); i++) {
      if (!allCodes.includes(i)) {
        missingInSequence.push(i);
      }
    }
    
    if (missingInSequence.length > 0) {
      console.log(`  - Códigos faltantes en secuencia: ${missingInSequence.slice(0, 20).join(', ')}${missingInSequence.length > 20 ? '...' : ''}`);
    }
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

compareExcelVsDB();