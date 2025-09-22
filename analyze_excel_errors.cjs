const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

console.log('=== ANÁLISIS DETALLADO DEL ARCHIVO EXCEL ===\n');

// Buscar el archivo Excel más reciente
const attachedDir = './attached_assets';
const files = fs.readdirSync(attachedDir).filter(f => f.includes('.xlsx') && f.includes('temas dani'));
const latestFile = files.sort().pop();

if (!latestFile) {
  console.error('❌ No se encontró el archivo Excel');
  process.exit(1);
}

const filePath = path.join(attachedDir, latestFile);
console.log(`📁 Analizando archivo: ${latestFile}`);
console.log(`📍 Ruta completa: ${filePath}\n`);

try {
  // Leer el archivo Excel
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

  console.log(`📊 INFORMACIÓN GENERAL:`);
  console.log(`Total de filas encontradas: ${data.length}`);
  console.log(`Nombre de la hoja: ${workbook.SheetNames[0]}\n`);

  // Mostrar estructura de columnas
  if (data.length > 0) {
    console.log(`📋 ESTRUCTURA DE COLUMNAS (primera fila):`);
    Object.keys(data[0]).forEach((key, index) => {
      console.log(`  ${String.fromCharCode(65 + index)}: ${key}`);
    });
    console.log('');
  }

  // Análisis detallado de errores potenciales
  console.log('🔍 ANÁLISIS DETALLADO DE ERRORES:\n');

  let problemRows = [];
  let propuestaStats = { empty: 0, filled: 0, total: 0 };
  let dateErrors = [];
  let missingFields = [];
  let duplicateCodes = [];
  let seenCodes = new Set();

  data.forEach((row, index) => {
    const rowNum = index + 2; // +2 porque Excel empieza en 1 y tiene header
    let hasError = false;
    let errors = [];

    // Verificar campos obligatorios (aproximados según la estructura esperada)
    const meetingTitle = row.__EMPTY_2 || row['__EMPTY_2'] || null; // Columna C
    const projectName = row.__EMPTY || row['__EMPTY'] || null; // Columna A  
    const taskTitle = row.__EMPTY_3 || row['__EMPTY_3'] || null; // Columna D

    if (!meetingTitle && !projectName && !taskTitle) {
      // Fila completamente vacía
      return;
    }

    // Verificar campos obligatorios
    if (!meetingTitle) {
      errors.push('Título de reunión faltante (Columna C)');
      hasError = true;
    }
    if (!projectName) {
      errors.push('Nombre de proyecto faltante (Columna A)');
      hasError = true;
    }
    if (!taskTitle) {
      errors.push('Título de tarea faltante (Columna D)');
      hasError = true;
    }

    // Verificar fechas (buscar columnas que podrían ser fechas)
    Object.keys(row).forEach(key => {
      const value = row[key];
      if (value && typeof value === 'string') {
        // Buscar patrones de fecha
        const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
        if (datePattern.test(value)) {
          const [day, month, year] = value.split('/').map(Number);
          if (month > 12 || day > 31 || year < 1900) {
            errors.push(`Fecha inválida en columna ${key}: ${value}`);
            dateErrors.push({ row: rowNum, column: key, value });
            hasError = true;
          }
        }
      }
    });

    // Verificar códigos de tarea (buscar columnas que podrían contener códigos)
    Object.keys(row).forEach(key => {
      const value = row[key];
      if (value && typeof value === 'string' && /^\d{3}$/.test(value)) {
        if (seenCodes.has(value)) {
          errors.push(`Código de tarea duplicado: ${value}`);
          duplicateCodes.push({ row: rowNum, code: value });
          hasError = true;
        } else {
          seenCodes.add(value);
        }
      }
    });

    // Verificar propuestas (columnas J, K, L aproximadas)
    const propuestaColumns = [
      row.__EMPTY_9 || row['__EMPTY_9'], // Columna J
      row.__EMPTY_10 || row['__EMPTY_10'], // Columna K  
      row.__EMPTY_11 || row['__EMPTY_11'] // Columna L
    ];

    propuestaStats.total++;
    const hasPropuesta = propuestaColumns.some(col => col && col.trim() !== '');
    if (hasPropuesta) {
      propuestaStats.filled++;
    } else {
      propuestaStats.empty++;
    }

    if (hasError) {
      problemRows.push({
        row: rowNum,
        errors: errors,
        data: row
      });
    }
  });

  // Mostrar resultados del análisis
  console.log(`🚨 FILAS CON PROBLEMAS IDENTIFICADAS: ${problemRows.length}`);
  if (problemRows.length > 0) {
    console.log('');
    problemRows.forEach(problem => {
      console.log(`❌ FILA ${problem.row}:`);
      problem.errors.forEach(error => {
        console.log(`   • ${error}`);
      });
      console.log('');
    });
  }

  console.log(`📊 ESTADÍSTICAS DE PROPUESTAS:`);
  console.log(`   Total de filas analizadas: ${propuestaStats.total}`);
  console.log(`   Filas con propuestas: ${propuestaStats.filled}`);
  console.log(`   Filas sin propuestas: ${propuestaStats.empty}`);
  console.log(`   Porcentaje vacío: ${((propuestaStats.empty / propuestaStats.total) * 100).toFixed(1)}%\n`);

  if (dateErrors.length > 0) {
    console.log(`📅 ERRORES DE FECHA ENCONTRADOS: ${dateErrors.length}`);
    dateErrors.forEach(error => {
      console.log(`   • Fila ${error.row}, Columna ${error.column}: ${error.value}`);
    });
    console.log('');
  }

  if (duplicateCodes.length > 0) {
    console.log(`🔢 CÓDIGOS DUPLICADOS ENCONTRADOS: ${duplicateCodes.length}`);
    duplicateCodes.forEach(dup => {
      console.log(`   • Fila ${dup.row}: Código ${dup.code}`);
    });
    console.log('');
  }

  // Mostrar muestra de datos para verificación
  console.log('📋 MUESTRA DE DATOS (primeras 3 filas):');
  data.slice(0, 3).forEach((row, index) => {
    console.log(`\nFila ${index + 2}:`);
    Object.entries(row).forEach(([key, value]) => {
      if (value) {
        console.log(`   ${key}: ${value}`);
      }
    });
  });

} catch (error) {
  console.error('❌ Error al procesar el archivo:', error.message);
  console.error('Stack:', error.stack);
}