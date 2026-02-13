/**
 * Migration: Fix companies table schema for UUID and businessCategory
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateDatabase() {
  let connection;
  try {
    console.log('🔄 Starting schema migration...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'B@raghava123',
      database: process.env.DB_NAME || 'simplifymove'
    });
    
    console.log('✅ Connected to database');
    
    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    console.log('✅ Foreign key checks disabled');
    
    // Drop dependent tables first
    console.log('🗑️  Dropping dependent tables...');
    const tablesToDrop = ['bookings', 'notifications', 'promotion_campaigns', 'wallet_transactions', 'wallets', 'audit_logs', 'email_config'];
    for (const table of tablesToDrop) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`  ✓ Dropped ${table}`);
      } catch (e) {
        console.log(`  ✗ Could not drop ${table}`);
      }
    }
    
    // Backup existing data
    console.log('📋 Backing up existing data...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS companies_backup AS SELECT * FROM companies
    `);
    console.log('✅ Backup created');
    
    // Drop existing table
    console.log('🗑️  Dropping old companies table...');
    await connection.execute('DROP TABLE IF EXISTS companies');
    
    // Create new table with correct schema
    console.log('📝 Creating new companies table with correct schema...');
    await connection.execute(`
      CREATE TABLE companies (
        id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(200) UNIQUE NOT NULL,
        companyId VARCHAR(100),
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(15),
        industry VARCHAR(100),
        businessCategory VARCHAR(100) DEFAULT 'General',
        companySize ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
        street VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        country VARCHAR(100) DEFAULT 'India',
        status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
        totalBookings INT DEFAULT 0,
        totalSpent DECIMAL(12,2) DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status),
        INDEX idx_country (country)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ New companies table created');
    
    // Restore data from backup (only keep first 20 rows to avoid ID issues)
    console.log('📥 Restoring data from backup...');
    try {
      const [backupData] = await connection.execute(`
        SELECT id, name, companyId, email, phone, industry, companySize, street, city, state, pincode, country, status, totalBookings, totalSpent, createdAt, updatedAt 
        FROM companies_backup 
        WHERE id IS NOT NULL 
        LIMIT 20
      `);
      
      if (backupData.length > 0) {
        for (const row of backupData) {
          try {
            await connection.execute(`
              INSERT INTO companies (id, name, companyId, email, phone, industry, companySize, street, city, state, pincode, country, status, totalBookings, totalSpent, createdAt, updatedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [row.id, row.name, row.companyId, row.email, row.phone, row.industry, row.companySize, row.street, row.city, row.state, row.pincode, row.country, row.status, row.totalBookings, row.totalSpent, row.createdAt, row.updatedAt]);
          } catch (e) {
            console.log(`⚠️  Skipped row with ID ${row.id}`);
          }
        }
        console.log(`✅ Restored ${backupData.length} companies`);
      }
    } catch (e) {
      console.log('⚠️  Could not restore data:', e.message);
    }
    
    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
    console.log('✅ Foreign key checks re-enabled');
    
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
