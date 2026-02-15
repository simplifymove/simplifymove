const http = require('http');

const testData = {
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "test@example.com",
    smtpPassword: "TestPassword789",
    fromEmail: "noreply@simplifymove.com",
    fromName: "SimplifyMove",
    enableSSL: true
  }
};

const json = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/v1/admin/settings',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(json)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
    console.log('\nDone. Check if platformSettings.json was updated with password.');
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
});

console.log('Sending test data:', json);
console.log('');
req.write(json);
req.end();
