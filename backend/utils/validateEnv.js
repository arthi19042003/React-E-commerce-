// Validate required environment variables
const validateEnv = () => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'PORT'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    process.exit(1);
  }

  console.log('✅ All required environment variables are set');
};

module.exports = validateEnv;