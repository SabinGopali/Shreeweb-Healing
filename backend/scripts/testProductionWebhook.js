import https from 'https';

console.log('🧪 Testing Production Webhook Endpoints\n');

// Test 1: Test endpoint (should work)
console.log('Test 1: Testing /webhook/test endpoint...');
https.get('https://omshreeguidance.com/webhook/test', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`Response: ${data}\n`);
    
    // Test 2: Order confirmation endpoint (currently failing)
    console.log('Test 2: Testing /webhook/order-confirmation endpoint...');
    const options = {
      hostname: 'omshreeguidance.com',
      path: '/webhook/order-confirmation',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 404) {
          console.log(`❌ Status: ${res.statusCode} - ENDPOINT NOT FOUND`);
          console.log(`Response: ${data}`);
          console.log('\n⚠️  This confirms the backend needs to be redeployed with webhook code.');
        } else {
          console.log(`✅ Status: ${res.statusCode}`);
          console.log(`Response: ${data}`);
          console.log('\n✅ Webhook endpoint is deployed!');
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Error:', error.message);
    });
    
    req.write(JSON.stringify({ test: true }));
    req.end();
  });
}).on('error', (error) => {
  console.error('❌ Error:', error.message);
});
