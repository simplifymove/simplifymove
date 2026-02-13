const mysql = require('mysql2/promise');

async function resetDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'B@raghava123',
      database: 'simplifymove'
    });

    console.log('✅ Connected to database');

    // Disable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✅ Disabled foreign key checks');

    // Drop all tables in correct order to avoid FK issues
    const tables = [
      'company_admin_invitations',
      'wallet_transactions',
      'wallets',
      'promotional_campaigns',
      'notifications',
      'audit_logs',
      'bookings',
      'email_configs',
      'vendor_services',
      'vendors',
      'users',
      'companies'
    ];

    for (const table of tables) {
      try {
        await connection.execute(`DROP TABLE IF EXISTS ${table}`);
        console.log(`✅ Dropped table: ${table}`);
      } catch (err) {
        console.log(`⚠️ Could not drop ${table}: ${err.message}`);
      }
    }

    // Re-enable foreign key checks
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Re-enabled foreign key checks');

    // Now Sequelize sync will create fresh tables from models
    console.log('\n✅ Database tables cleared. Run backend to sync models.');

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

resetDatabase();
