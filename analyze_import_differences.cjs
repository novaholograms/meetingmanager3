const XLSX = require('xlsx');

async function analyzeImportDifferences() {
  console.log("🔍 ANALIZANDO DIFERENCIAS DE IMPORTACIÓN");
  console.log("=====================================");
  
  try {
    // Leer archivo Excel más reciente
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755786101446.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Excel contiene ${excelData.length} filas`);
    
    // Filtrar filas válidas (que tengan datos en las columnas principales)
    const validRows = excelData.filter((row, index) => {
      if (index === 0) return false; // Skip header
      return row[0] && row[1] && row[2] && row[3]; // Comité, Objetivo, Instrumento, Tema
    });
    
    console.log(`📋 Filas válidas en Excel: ${validRows.length}`);
    
    console.log(`💾 Según SQL anterior: hay 256 tareas en base de datos`);
    
    // Analizar estructura de Excel
    console.log("\n📈 ESTRUCTURA DEL EXCEL:");
    console.log("Columnas detectadas:");
    if (excelData[0]) {
      excelData[0].forEach((header, index) => {
        console.log(`  ${String.fromCharCode(65 + index)}: ${header || 'Sin encabezado'}`);
      });
    }
    
    // Muestrea las primeras 5 filas válidas
    console.log("\n📋 MUESTRA DE DATOS EXCEL (primeras 5 filas):");
    validRows.slice(0, 5).forEach((row, index) => {
      console.log(`Fila ${index + 2}:`);
      console.log(`  A (Comité): ${row[0] || 'vacío'}`);
      console.log(`  B (Objetivo): ${row[1] || 'vacío'}`);
      console.log(`  C (Instrumento): ${row[2] || 'vacío'}`);
      console.log(`  D (Tema): ${row[3] || 'vacío'}`);
      console.log(`  E (Descripción): ${row[4] || 'vacío'}`);
      console.log(`  F (Fecha): ${row[5] || 'vacío'}`);
      console.log("  ---");
    });
    
    // Verificar proyectos únicos en Excel
    const excelProjects = [...new Set(validRows.map(row => row[0]))];
    console.log(`\n🏢 PROYECTOS ÚNICOS EN EXCEL (${excelProjects.length}):`);
    excelProjects.forEach(project => console.log(`  - ${project}`));
    
    // Proyectos conocidos en BD (según consulta anterior)
    const bdProjects = ["PROCESOS-TOSHIKO", "KINTO", "VN-VO-FLOTAS", "POSTVENTA", "TIS", "TFS", "DLLO.RED"];
    console.log(`\n🏢 PROYECTOS CONOCIDOS EN BD:`);
    bdProjects.forEach(project => console.log(`  - ${project}`));
    
    // Buscar discrepancias
    console.log("\n🔍 ANÁLISIS DE DISCREPANCIAS:");
    
    // Proyectos en Excel que no coinciden con BD
    const unmatchedProjects = excelProjects.filter(excelProject => 
      !bdProjects.some(bdProject => 
        bdProject.toLowerCase().includes(excelProject.toLowerCase()) ||
        excelProject.toLowerCase().includes(bdProject.toLowerCase())
      )
    );
    
    if (unmatchedProjects.length > 0) {
      console.log("❌ PROYECTOS EN EXCEL SIN COINCIDENCIA EN BD:");
      unmatchedProjects.forEach(project => console.log(`  - ${project}`));
    }
    
    // Verificar códigos en Excel
    const excelCodes = validRows.map(row => row[11]).filter(code => code); // Columna L
    const duplicateCodes = excelCodes.filter((code, index) => excelCodes.indexOf(code) !== index);
    
    if (duplicateCodes.length > 0) {
      console.log(`\n⚠️  CÓDIGOS DUPLICADOS EN EXCEL: ${[...new Set(duplicateCodes)].join(', ')}`);
    }
    
    // Códigos conocidos en BD (rango 1-260)
    const bdCodesRange = Array.from({length: 260}, (_, i) => (i + 1).toString());
    const codesNotInBd = excelCodes.filter(code => code && !bdCodesRange.includes(code.toString()));
    
    console.log(`\n📊 RESUMEN DE CÓDIGOS:`);
    console.log(`  - Códigos en Excel: ${excelCodes.filter(c => c).length}`);
    console.log(`  - Códigos conocidos en BD: 256 (rango 1-260)`);
    console.log(`  - Códigos de Excel que podrían faltar en BD: ${codesNotInBd.length}`);
    
    // Analizar distribución de códigos
    const codeNumbers = excelCodes.map(c => parseInt(c)).filter(c => !isNaN(c)).sort((a, b) => a - b);
    console.log(`\n📈 DISTRIBUCIÓN DE CÓDIGOS EN EXCEL:`);
    console.log(`  - Código más bajo: ${Math.min(...codeNumbers)}`);
    console.log(`  - Código más alto: ${Math.max(...codeNumbers)}`);
    console.log(`  - Total códigos numéricos: ${codeNumbers.length}`);
    
    // Identificar rangos de códigos faltantes
    const missingCodes = [];
    for (let i = Math.min(...codeNumbers); i <= Math.max(...codeNumbers); i++) {
      if (!codeNumbers.includes(i)) {
        missingCodes.push(i);
      }
    }
    
    if (missingCodes.length > 0) {
      console.log(`\n❌ CÓDIGOS FALTANTES EN EXCEL (en el rango): ${missingCodes.slice(0, 20).join(', ')}${missingCodes.length > 20 ? '...' : ''}`);
    }
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

analyzeImportDifferences();