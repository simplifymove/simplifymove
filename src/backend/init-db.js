require('dotenv').config();

const sequelize = require('./config/database');
const { initializeModels } = require('./models');

async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Initialize models
    const models = initializeModels();
    console.log('✅ Models initialized');

    // Sync database - create tables in explicit order to handle FK constraints
    // First, disable FK checks during sync
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    // Sync without sync all at once - let Sequelize handle ordering
    await sequelize.sync({ alter: false, force: false });
    console.log('✅ Database tables synchronized');

    // Re-enable FK checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Foreign key checks re-enabled');

    // Close connection
    await sequelize.close();
    console.log('✅ Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

initializeDatabase();
