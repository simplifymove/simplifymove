require('dotenv').config();
const mysql = require('mysql2/promise');

async function recreateDatabase() {
  let connection;
  try {
    console.log('🔄 Recreating database...');
    
    // Connect to MySQL without selecting a database
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'B@raghava123'
    });

    console.log('✅ Connected to MySQL');

    // Drop existing database
    try {
      await connection.execute('DROP DATABASE IF EXISTS simplifymove');
      console.log('✅ Old database dropped');
    } catch (err) {
      console.log('⚠️  Could not drop database:', err.message);
    }

    // Create new database
    await connection.execute('CREATE DATABASE simplifymove CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✅ New database created');

    await connection.end();

    // Now sync the new database with models
    console.log('🔄 Syncing models with new database...');
    const sequelize = require('./config/database');
    const { initializeModels } = require('./models');

    await sequelize.authenticate();
    console.log('✅ Connected to new database');

    initializeModels();
    console.log('✅ Models initialized');

    await sequelize.sync({ alter: false, force: false });
    console.log('✅ Tables created from models');

    await sequelize.close();
    console.log('✅ Database recreation complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

recreateDatabase();
