#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testClaritySectionAPI() {
  console.log('🧪 Testing ShreeWeb Clarity Section API...\n');

  try {
    // Test public endpoint
    console.log('1. Testing public clarity section endpoint...');
    const publicResponse = await fetch(`${BASE_URL}/backend/shreeweb-clarity-section/public`);
    
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log('✅ Public endpoint working');
      console.log('📋 Public data:', {
        title: publicData.claritySection?.title,
        subtitle: publicData.claritySection?.subtitle,
        buttonText: publicData.claritySection?.buttonText,
        isActive: publicData.claritySection?.isActive
      });
    } else {
      console.log('❌ Public endpoint failed:', publicResponse.status, publicResponse.statusText);
    }

    console.log('\n2. Testing admin endpoints (requires authentication)...');
    console.log('⚠️  Admin endpoints require authentication - test these through the CMS interface');
    
    console.log('\n🎉 API test completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:5173/shreeweb/home to see the clarity section');
    console.log('   2. Visit http://localhost:5173/shreeweb/cms/clarity-section to manage content');
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3000');
  }
}

// Run the test
testClaritySectionAPI();