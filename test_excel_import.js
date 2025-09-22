// Script para crear un archivo Excel de prueba con el formato correcto
const XLSX = require('xlsx');

// Datos de ejemplo para el archivo Excel
const testData = [
  {
    'A': 'Diseñar interfaz de usuario',
    'B': 'Crear mockups y prototipos para la aplicación',
    'C': '01/01/2025',
    'D': '15/01/2025',
    'E': 'pending',
    'F': 'Proyecto Web',
    'G': 'Frontend',
    'H': 'UI/UX'
  },
  {
    'A': 'Implementar base de datos',
    'B': 'Configurar y estructurar la base de datos PostgreSQL',
    'C': '16/01/2025',
    'D': '31/01/2025',
    'E': 'in-progress',
    'F': 'Proyecto Web',
    'G': 'Backend',
    'H': 'Database'
  },
  {
    'A': 'Crear API REST',
    'B': 'Desarrollar endpoints para la comunicación frontend-backend',
    'C': '01/02/2025',
    'D': '15/02/2025',
    'E': 'pending',
    'F': 'Proyecto Web',
    'G': 'Backend',
    'H': 'API'
  },
  {
    'A': 'Testing unitario',
    'B': 'Escribir y ejecutar pruebas unitarias',
    'C': '16/02/2025',
    'D': '28/02/2025',
    'E': 'pending',
    'F': 'Proyecto Web',
    'G': 'Testing',
    'H': 'Unit Tests'
  }
];

// Crear el workbook
const workbook = XLSX.utils.book_new();

// Crear la hoja de trabajo
const worksheet = XLSX.utils.json_to_sheet(testData, {
  header: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
});

// Agregar la hoja al workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Tareas');

// Guardar el archivo
XLSX.writeFile(workbook, 'test_projects.xlsx');

console.log('Archivo Excel de prueba creado: test_projects.xlsx');