import https from 'https';

console.log('🧪 Quick Webhook Diagnostic Test\n');

// Test data with your email
const testOrder = {
  id: 'test_' + Date.now(),
  order_number: '9999',
  email: 'YOUR_EMAIL@example.com', // ⚠️ REPLACE WITH YOUR ACTUAL EMAIL
  customer: {
    first_name: 'Test',
    last_name: 'Customer'
  },
  line_items: [
    {
      title: 'Test Product',
      quantity: 1,
      price: '0.00'
    }
  ],
  total_price: '0.00',
  subtotal_price: '0.00',
  total_tax: '0.00',
  total_shipping_price_set: {
    shop_money: {
      amount: '0.00'
    }
  },
  currency: 'USD',
  created_at: new Date().toISOString(),
  shipping_address: {
    name: 'Test Customer',
    address1: '123 Test St',
    city: 'Test City',
    province: 'CA',
    zip: '12345',
    country: 'United States'
  }
};

const postData = JSON.stringify(testOrder);

const options = {
  hostname: 'omshreeguidance.com',
  path: '/webhook/order-confirmation',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'X-Shopify-Topic': 'orders/create',
    'X-Shopify-Shop-Domain': 'test-store.myshopify.com'
  }
};

console.log('📤 Sending test order to webhook...');
console.log('📧 Email will be sent to:', testOrder.email);
console.log('');

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('📥 Response Status:', res.statusCode);
    console.log('📥 Response Body:', data);
    console.log('');
    
    if (res.statusCode === 200) {
      console.log('✅ SUCCESS! Check your email inbox.');
      console.log('   Email should arrive in 1-2 minutes.');
      console.log('   Check spam folder if not in inbox.');
    } else if (res.statusCode === 401) {
      console.log('⚠️  Signature verification failed (expected without secret)');
      console.log('   But webhook endpoint is working!');
    } else if (res.statusCode === 400) {
      console.log('⚠️  Bad request - check the error message above');
    } else {
      console.log('❌ Error - check the response above');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(postData);
req.end();
