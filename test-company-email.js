const http = require('http');

const companyData = {
  name: "Test Email Company",
  email: "testco@example.com",
  phone: "9876543210",
  industry: "Technology",
  businessCategory: "Software",
  companySize: "11-50",
  street: "123 Test Street",
  city: "Test City",
  state: "TS",
  pincode: "123456",
  country: "India",
  status: "active",
  contactName: "John Admin",
  contactEmail: "john.admin@example.com",
  contactPhone: "9876543210",
  contactDesignation: "Director"
};

const json = JSON.stringify(companyData);

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/v1/companies',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json)
  }
};

console.log('Creating company with contact email...');
console.log('Company data:', JSON.stringify(companyData, null, 2));
console.log('');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', JSON.parse(data));
    console.log('');
    console.log('Check the backend terminal for [EMAIL] messages to see if invitation email was sent.');
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

req.write(json);
req.end();
