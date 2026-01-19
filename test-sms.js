const fetch = require('node-fetch');

async function testSMS() {
  try {
    const response = await fetch('http://localhost:3000/api/test-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '+919876543210',
        name: 'Test User'
      })
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testSMS();
