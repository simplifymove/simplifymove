/**
 * Quick Fix: Recreate companies table with correct schema
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixDatabase() {
  let connection;
  try {
    console.log('🔄 Fixing database schema...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'B@raghava123',
      database: process.env.DB_NAME || 'simplifymove'
    });
    
    console.log('✅ Connected to database');
    
    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS=0');
    
    // Drop existing table
    console.log('🗑️  Dropping companies table...');
    await connection.execute('DROP TABLE IF EXISTS companies');
    
    // Create new table with correct schema
    console.log('📝 Creating companies table...');
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
    console.log('✅ Companies table created');
    
    // Insert sample companies
    console.log('📝 Inserting sample companies...');
    const companies = [
      {
        name: 'Acme Corporation',
        email: 'admin@acme.com',
        phone: '+91 22 1234 5678',
        industry: 'Technology',
        businessCategory: 'Technology',
        companySize: '201-500',
        city: 'Mumbai',
        country: 'India',
        status: 'active'
      },
      {
        name: 'Tech Solutions Ltd',
        email: 'info@techsol.com',
        phone: '+91 80 2222 3333',
        industry: 'IT Services',
        businessCategory: 'Technology',
        companySize: '51-200',
        city: 'Bangalore',
        country: 'India',
        status: 'active'
      },
      {
        name: 'Global Industries',
        email: 'contact@global.com',
        phone: '+91 33 4444 5555',
        industry: 'Manufacturing',
        businessCategory: 'Manufacturing',
        companySize: '1000+',
        city: 'Kolkata',
        country: 'India',
        status: 'active'
      }
    ];
    
    let added = 0;
    for (const company of companies) {
      try {
        await connection.execute(
          `INSERT INTO companies (name, email, phone, industry, businessCategory, companySize, city, country, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [company.name, company.email, company.phone, company.industry, company.businessCategory, company.companySize, company.city, company.country, company.status]
        );
        added++;
        console.log(`  ✓ Added: ${company.name}`);
      } catch (e) {
        console.log(`  ✗ Error: ${e.message}`);
      }
    }
    
    console.log(`✅ Inserted ${added} sample companies`);
    
    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS=1');
    
    console.log('✅ Database fixed successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

fixDatabase();
