import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🧪 Testing Email Capture API...\n');

    // Test without authentication (should work for public endpoint)
    const response = await fetch('http://localhost:3000/backend/email-captures?limit=10', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);

    const data = await response.json();
    console.log('\nResponse:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ API is working!');
      console.log(`   Total subscribers: ${data.pagination.total}`);
      console.log(`   Returned: ${data.data.length} records`);
      
      if (data.data.length > 0) {
        console.log('\n📧 Sample subscribers:');
        data.data.slice(0, 3).forEach((sub, i) => {
          console.log(`   ${i + 1}. ${sub.email} - ${sub.subscribed ? 'Subscribed' : 'Unsubscribed'}`);
        });
      }
    } else {
      console.log('\n❌ API returned error');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();
