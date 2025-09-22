const XLSX = require('xlsx');

function compareExcelDbPrecise() {
  console.log("🔍 COMPARACIÓN PRECISA: EXCEL VS BASE DE DATOS");
  console.log("=============================================");
  
  try {
    // Leer archivo Excel más reciente
    const workbook = XLSX.readFile('attached_assets/temas dani_subido18julio_1755787410199.xlsx');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Filtrar filas válidas del Excel
    const validRows = excelData.slice(1).filter(row => 
      row[6] && row[9] && // Tiene tema (G) y código (J)
      !isNaN(parseInt(row[9])) // El código es numérico
    );
    
    console.log(`📊 Filas válidas en Excel: ${validRows.length}`);
    
    // Extraer todos los códigos únicos del Excel
    const excelCodes = [...new Set(validRows.map(row => parseInt(row[9])).filter(code => !isNaN(code)))].sort((a, b) => a - b);
    
    console.log(`📋 Códigos únicos en Excel: ${excelCodes.length}`);
    console.log(`📈 Rango de códigos en Excel: ${Math.min(...excelCodes)} - ${Math.max(...excelCodes)}`);
    
    // Códigos reportados como en BD (según consulta SQL)
    // Vamos a simular los códigos 1-260 excepto los que sabemos que faltan
    const potentialDbCodes = [];
    for (let i = 1; i <= 260; i++) {
      potentialDbCodes.push(i);
    }
    
    console.log(`💾 Códigos potenciales en BD: ${potentialDbCodes.length}`);
    
    // Encontrar códigos que están en Excel pero podrían no estar en BD
    console.log(`\n🔍 TODOS LOS CÓDIGOS EN EXCEL:`);
    console.log(`Códigos: ${excelCodes.join(', ')}`);
    
    // Analizar códigos específicos mencionados por el usuario
    const specificCodes = [258, 259, 260];
    console.log(`\n🎯 ANÁLISIS DE CÓDIGOS ESPECÍFICOS (258, 259, 260):`);
    
    specificCodes.forEach(code => {
      const excelRows = validRows.filter(row => parseInt(row[9]) === code);
      if (excelRows.length > 0) {
        const row = excelRows[0];
        console.log(`\n📌 Código ${code}:`);
        console.log(`  - Tema: "${row[6]}"`);
        console.log(`  - Proyecto: "${row[1]}"`);
        console.log(`  - Objetivo: "${row[10] || 'vacío'}"`);
        console.log(`  - Instrumento: "${row[11] || 'vacío'}"`);
        console.log(`  - En Excel: SÍ`);
        
        // Si es el código 260, analizar más detalles
        if (code === 260) {
          console.log(`  - Propuesta completa: "${row[7] || 'vacío'}"`);
          console.log(`  - Respuesta completa: "${row[8] || 'vacío'}"`);
          console.log(`  - Fecha: "${row[2] || 'vacío'}"`);
          console.log(`  - Participantes: "${row[5] || 'vacío'}"`);
        }
      } else {
        console.log(`\n❌ Código ${code}: NO ENCONTRADO EN EXCEL`);
      }
    });
    
    // Buscar secuencias de códigos faltantes
    console.log(`\n🔍 ANÁLISIS DE SECUENCIA:`);
    const missingInSequence = [];
    for (let i = Math.min(...excelCodes); i <= Math.max(...excelCodes); i++) {
      if (!excelCodes.includes(i)) {
        missingInSequence.push(i);
      }
    }
    
    if (missingInSequence.length > 0) {
      console.log(`❌ Códigos faltantes en secuencia del Excel: ${missingInSequence.join(', ')}`);
    } else {
      console.log(`✅ Excel tiene secuencia completa de códigos`);
    }
    
    // Analizar últimos códigos del Excel
    console.log(`\n📊 ÚLTIMOS 10 CÓDIGOS EN EXCEL:`);
    const lastCodes = excelCodes.slice(-10);
    lastCodes.forEach(code => {
      const row = validRows.find(r => parseInt(r[9]) === code);
      console.log(`  ${code}: "${row ? row[6] : 'no encontrado'}"`);
    });
    
    // Verificar si hay códigos duplicados en Excel
    const allExcelCodesWithDuplicates = validRows.map(row => parseInt(row[9])).filter(code => !isNaN(code));
    const duplicates = allExcelCodesWithDuplicates.filter((code, index) => allExcelCodesWithDuplicates.indexOf(code) !== index);
    
    if (duplicates.length > 0) {
      console.log(`\n⚠️  CÓDIGOS DUPLICADOS EN EXCEL: ${[...new Set(duplicates)].join(', ')}`);
    }
    
  } catch (error) {
    console.error("❌ Error en análisis:", error.message);
  }
}

compareExcelDbPrecise();