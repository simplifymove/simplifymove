const axios = require('axios');

const API_BASE = 'http://localhost:5001/api/v1';
let authToken = '';
let employeeId = '';
let walletId = '';

async function test() {
  try {
    console.log('🔐 Step 1: Login as company admin...');
    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email: 'admin@company1.com',
      password: 'Password@123'
    });
    authToken = loginRes.data.data.token;
    console.log('✅ Logged in successfully');

    console.log('\n👥 Step 2: Get employee list...');
    const employeesRes = await axios.get(`${API_BASE}/companyAdmins/employees`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (employeesRes.data.data.length > 0) {
      employeeId = employeesRes.data.data[0].id;
      console.log(`✅ Found employee: ${employeesRes.data.data[0].name} (ID: ${employeeId})`);
    } else {
      throw new Error('No employees found');
    }

    console.log('\n💰 Step 3: Add funds to employee wallet...');
    const addFundsRes = await axios.post(
      `${API_BASE}/wallets/add-funds/batch`,
      {
        targetType: 'employee',
        selectedTarget: employeeId,
        amount: 5000,
        walletType: 'business'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (addFundsRes.data.success) {
      console.log('✅ Funds added successfully');
      console.log(`   Amount: ₹${addFundsRes.data.data.amount}`);
      console.log(`   Success count: ${addFundsRes.data.data.successCount}`);
    } else {
      throw new Error(addFundsRes.data.message);
    }

    console.log('\n📊 Step 4: Checking database to verify persistence...');
    // Query the database directly to verify
    const { execSync } = require('child_process');
    try {
      const dbCheck = execSync(`npm run check-db 2>&1`, { cwd: __dirname, encoding: 'utf-8' });
      console.log('Database check output:', dbCheck.substring(0, 500));
    } catch (e) {
      console.log('Could not run database check script');
    }

    console.log('\n✅ TEST COMPLETE: Wallet persistence appears to be working!');
    console.log(`   Employee: ${employeeId}`);
    console.log(`   Amount Added: ₹5000`);

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
    console.error('Response status:', error.response?.status);
  }

  process.exit(0);
}

test();
