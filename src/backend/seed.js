/**
 * Seed Sample Data for SimplifyMove
 * Using raw SQL since the actual database schema differs from Sequelize model
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  let connection;
  try {
    console.log('🌱 Seeding database...');
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'B@raghava123',
      database: process.env.DB_NAME || 'simplifymove'
    });
    
    console.log('✅ Connected to database');
    
    // Sample companies data
    const companies = [
      {
        name: 'Acme Corporation',
        email: 'admin@acme.com',
        phone: '+91 22 1234 5678',
        industry: 'Technology',
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
        companySize: '1000+',
        city: 'Kolkata',
        country: 'India',
        status: 'active'
      }
    ];
    
    // Insert companies
    let added = 0;
    for (const company of companies) {
      try {
        const [existing] = await connection.execute(
          'SELECT id FROM companies WHERE email = ?',
          [company.email]
        );
        
        if (existing.length === 0) {
          // Insert with generated UUID
          const id = uuidv4();
          await connection.execute(
            `INSERT INTO companies (id, name, email, phone, industry, companySize, city, country, status, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [id, company.name, company.email, company.phone, company.industry, 
             company.companySize, company.city, company.country, company.status]
          );
          console.log(`  ✓ Added: ${company.name}`);
          added++;
        } else {
          console.log(`  · Exists: ${company.name}`);
        }
      } catch (e) {
        console.log(`  ✗ Error with ${company.name}: ${e.message}`);
      }
    }
    
    console.log(`✅ Seeded ${added} new companies`);
    
    // Verify data was inserted
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM companies');
    console.log(`📊 Total companies in database: ${rows[0].count}`);
    
    console.log('✅ Database seeded successfully!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

seedDatabase();
