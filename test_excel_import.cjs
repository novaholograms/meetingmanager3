// Script para crear un archivo Excel de prueba con el formato correcto
const XLSX = require('xlsx');

// Datos de ejemplo para el archivo Excel
const testData = [
  ['Diseñar interfaz de usuario', 'Crear mockups y prototipos para la aplicación', '01/01/2025', '15/01/2025', 'pending', 'Proyecto Web', 'Frontend', 'UI/UX'],
  ['Implementar base de datos', 'Configurar y estructurar la base de datos PostgreSQL', '16/01/2025', '31/01/2025', 'in-progress', 'Proyecto Web', 'Backend', 'Database'],
  ['Crear API REST', 'Desarrollar endpoints para la comunicación frontend-backend', '01/02/2025', '15/02/2025', 'pending', 'Proyecto Web', 'Backend', 'API'],
  ['Testing unitario', 'Escribir y ejecutar pruebas unitarias', '16/02/2025', '28/02/2025', 'pending', 'Proyecto Web', 'Testing', 'Unit Tests']
];

// Crear el workbook
const workbook = XLSX.utils.book_new();

// Crear la hoja de trabajo
const worksheet = XLSX.utils.aoa_to_sheet(testData);

// Agregar la hoja al workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');

// Guardar el archivo
XLSX.writeFile(workbook, 'test_projects.xlsx');

console.log('Archivo Excel de prueba creado: test_projects.xlsx');