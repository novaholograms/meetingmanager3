// Script para configurar el entorno de producción
const path = require('path');
const fs = require('fs');

// Función para verificar y configurar el entorno de producción
function setupProductionEnvironment() {
  console.log('🚀 Configurando entorno de producción...');
  
  // Verificar que estamos en producción
  const isProduction = process.env.NODE_ENV === 'production';
  console.log('📊 Entorno:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
  
  // Verificar variables de entorno críticas
  const requiredEnvVars = ['DATABASE_URL', 'SESSION_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Variables de entorno faltantes:', missingVars);
  }
  
  // Configurar variables específicas para producción
  if (isProduction) {
    // Configurar puerto específico para producción
    process.env.PORT = process.env.PORT || '3000';
    
    // Configurar URL base para producción
    process.env.BASE_URL = process.env.BASE_URL || 'https://consultator.replit.app';
    
    // Configurar configuración de sesiones para producción
    process.env.SESSION_NAME = 'consultator-session';
    process.env.COOKIE_SECURE = 'false'; // Replit puede tener problemas con HTTPS interno
    process.env.COOKIE_SAME_SITE = 'lax';
    
    console.log('✅ Configuración de producción aplicada');
  }
  
  // Verificar archivos críticos
  const criticalFiles = [
    'server/index.ts',
    'server/auth.ts',
    'client/src/context/AuthContext.tsx',
    'dist/index.js'
  ];
  
  const missingFiles = criticalFiles.filter(file => !fs.existsSync(file));
  if (missingFiles.length > 0) {
    console.warn('⚠️  Archivos críticos faltantes:', missingFiles);
  }
  
  return {
    isProduction,
    missingVars,
    missingFiles,
    config: {
      port: process.env.PORT,
      baseUrl: process.env.BASE_URL,
      dbUrl: process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada'
    }
  };
}

// Función para validar la configuración de la base de datos
async function validateDatabaseConnection() {
  console.log('🔍 Verificando conexión a la base de datos...');
  
  try {
    // Importar dinámicamente las dependencias
    const { db } = require('./server/db');
    
    // Intentar hacer una consulta simple
    const result = await db.execute('SELECT 1 as test');
    console.log('✅ Conexión a la base de datos exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error.message);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🏗️  Iniciando configuración de producción...\n');
  
  // Configurar entorno
  const config = setupProductionEnvironment();
  
  // Mostrar configuración
  console.log('\n📋 Configuración actual:');
  console.log(JSON.stringify(config, null, 2));
  
  // Validar base de datos
  if (config.config.dbUrl === '✅ Configurada') {
    await validateDatabaseConnection();
  }
  
  console.log('\n🎯 Configuración completada');
  
  // Si estamos en producción, iniciar el servidor
  if (config.isProduction) {
    console.log('🚀 Iniciando servidor de producción...');
    require('./dist/index.js');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { setupProductionEnvironment, validateDatabaseConnection };