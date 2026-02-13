/**
 * Simple fix: Just ensure businessCategory column exists
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function quickFix() {
  let connection;
  try {
    console.log('🔄 Quick fix...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'B@raghava123',
      database: process.env.DB_NAME || 'simplifymove'
    });
    
    console.log('✅ Connected to database');
    
    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    console.log('✅ Foreign keys disabled');
    
    // Check if companies table exists
    try {
      const [tables] = await connection.execute(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'companies'"
      );
      
      if (tables.length === 0) {
        console.log('❌ Companies table does not exist. Creating...');
        
        // Create companies table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS companies (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(200) UNIQUE NOT NULL,
            companyId VARCHAR(100),
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(15),
            industry VARCHAR(100),
            businessCategory VARCHAR(100) DEFAULT 'General',
            companySize VARCHAR(50),
            street VARCHAR(255),
            city VARCHAR(100),
            state VARCHAR(100),
            pincode VARCHAR(10),
            country VARCHAR(100) DEFAULT 'India',
            status VARCHAR(50) DEFAULT 'active',
            totalBookings INT DEFAULT 0,
            totalSpent DECIMAL(12,2) DEFAULT 0,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);
        console.log('✅ Companies table created');
      } else {
        console.log('✓ Companies table exists');
        
        // Check if businessCategory column exists
        const [cols] = await connection.execute(
          "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'companies' AND COLUMN_NAME = 'businessCategory'"
        );
        
        if (cols.length === 0) {
          console.log('📝 Adding businessCategory column...');
          await connection.execute(`
            ALTER TABLE companies ADD COLUMN businessCategory VARCHAR(100) DEFAULT 'General' AFTER industry
          `);
          console.log('✅ businessCategory column added');
        } else {
          console.log('✓ businessCategory column already exists');
        }
      }
    } catch (e) {
      console.error('Error checking/creating table:', e.message);
    }
    
    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
    console.log('✅ Foreign keys re-enabled');
    
    console.log('✅ Quick fix complete!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

quickFix();
