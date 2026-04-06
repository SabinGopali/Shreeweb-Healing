import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('Testing /backend/email-captures API...\n');
    
    const url = 'http://localhost:5000/backend/email-captures?subscribed=true&limit=10';
    console.log('URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ API Response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('\n❌ API Error:');
      const text = await response.text();
      console.log(text);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
