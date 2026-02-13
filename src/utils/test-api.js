// Quick test to verify the data flow works correctly across frontend and backend
// This file can be deleted after testing

console.log('🔍 Testing SimplifyMove Data Flow...\n');

const apiUrl = 'http://localhost:5001/api/v1';

async function testAPI() {
  try {
    console.log('1️⃣  Testing Backend API...');
    const response = await fetch(`${apiUrl}/companies`);
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log(`✅ API returned ${data.data.length} companies`);
      console.log('📊 Sample company:');
      const sample = data.data[0];
      console.log(`   - Name: ${sample.name}`);
      console.log(`   - Email: ${sample.email}`);
      console.log(`   - Category: ${sample.businessCategory}`);
      console.log(`   - Status: ${sample.status}\n`);
      
      console.log('2️⃣  Testing Company Creation...');
      const newCompany = {
        name: `Test Company ${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        phone: '+91 9876543210',
        industry: 'Technology',
        businessCategory: 'Technology',
        companySize: '11-50',
        city: 'Bangalore',
        country: 'India',
        status: 'active'
      };
      
      const createResponse = await fetch(`${apiUrl}/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCompany)
      });
      
      const createData = await createResponse.json();
      if (createData.success) {
        console.log(`✅ Company created successfully!`);
        console.log(`   - ID: ${createData.data.id}`);
        console.log(`   - Name: ${createData.data.name}`);
        console.log(`   - Category: ${createData.data.businessCategory}\n`);
        
        console.log('✅ All tests passed! System is working correctly.');
        console.log('\n📋 Frontend should now:');
        console.log('   1. Display 4 companies in the table');
        console.log('   2. Allow adding new companies with Business Category');
        console.log('   3. Allow selecting dates for registration/expiry');
      } else {
        console.log(`❌ Company creation failed: ${createData.message}`);
      }
    } else {
      console.log('❌ API response format unexpected');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Auto-run test
testAPI();
