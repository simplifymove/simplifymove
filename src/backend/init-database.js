/**
 * Initialize database using Sequelize
 */

require('dotenv').config();
const sequelize = require('./config/database');
const { initializeModels } = require('./models');

async function initDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Initialize models
    initializeModels(sequelize);
    
    // Authenticate connection
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    
    // Sync all tables - this will create or update tables based on models
    console.log('📝 Syncing models...');
    await sequelize.sync({ alter: true });
    console.log('✅ All tables synced');
    
    console.log('✅ Database initialized successfully!');
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Initialization failed:', error.message);
    process.exit(1);
  }
}

initDatabase();
