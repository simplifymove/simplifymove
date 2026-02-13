// Test update company endpoint
const apiUrl = 'http://localhost:5001/api/v1';

async function testUpdate() {
  try {
    console.log('🧪 Testing Company Update...\n');

    // Get all companies
    const getResponse = await fetch(`${apiUrl}/companies`);
    const getData = await getResponse.json();
    const firstCompany = getData.data[0];

    console.log(`1️⃣  Updating company: ${firstCompany.name}`);
    
    // Update company
    const updateData = {
      name: `${firstCompany.name} - Updated ${Date.now()}`,
      email: firstCompany.email,
      phone: '+91 9999999999',
      industry: 'Updated Industry',
      businessCategory: 'Finance',
      city: 'Updated City'
    };

    const updateResponse = await fetch(`${apiUrl}/companies/${firstCompany.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    const updateResult = await updateResponse.json();
    if (updateResult.success) {
      console.log(`✅ Company updated successfully!`);
      console.log(`   - New Name: ${updateResult.data.name}`);
      console.log(`   - New Phone: ${updateResult.data.phone}`);
      console.log(`   - New Category: ${updateResult.data.businessCategory}\n`);
      console.log('✅ Update endpoint is working!');
    } else {
      console.log(`❌ Update failed: ${updateResult.message}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUpdate();
