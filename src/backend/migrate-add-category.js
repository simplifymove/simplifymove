/**
 * Migration: Add businessCategory column to companies table
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateDatabase() {
  let connection;
  try {
    console.log('🔄 Starting migration...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'B@raghava123',
      database: process.env.DB_NAME || 'simplifymove'
    });
    
    console.log('✅ Connected to database');
    
    // Check if businessCategory column exists
    try {
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_NAME = 'companies' AND COLUMN_NAME = 'businessCategory'`
      );
      
      if (columns.length === 0) {
        console.log('📝 Adding businessCategory column...');
        await connection.execute(
          `ALTER TABLE companies ADD COLUMN businessCategory VARCHAR(100) DEFAULT 'General' AFTER industry`
        );
        console.log('✅ businessCategory column added');
      } else {
        console.log('✓ businessCategory column already exists');
      }
    } catch (e) {
      console.log('⚠️  Error checking column:', e.message);
    }
    
    console.log('✅ Migration completed successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

migrateDatabase();
