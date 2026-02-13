require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabase() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'B@raghava123',
      database: 'simplifymove'
    });

    console.log('✅ Connected to database\n');

    // Check companies
    const [companies] = await conn.execute('SELECT id, name, email, status FROM companies');
    console.log('📊 Companies in database:', companies.length);
    companies.forEach((c, i) => {
      console.log(`  ${i+1}. ${c.name} (${c.email}) - ${c.status}`);
    });

    // Check if businessCategory column exists
    const [tables] = await conn.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'companies' AND COLUMN_NAME = 'businessCategory'`
    );
    console.log('\n✅ businessCategory column exists:', tables.length > 0 ? 'YES' : 'NO');

    // Show all columns in companies table
    const [cols] = await conn.execute(
      `SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_NAME = 'companies' ORDER BY ORDINAL_POSITION`
    );
    console.log('\n📋 Companies table structure:');
    cols.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
    });

    await conn.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
