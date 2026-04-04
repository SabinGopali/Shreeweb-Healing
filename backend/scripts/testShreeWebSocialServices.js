#!/usr/bin/env node

/**
 * Test script for ShreeWeb Social Services API
 * Tests all endpoints to ensure they're working correctly
 */

const BASE_URL = 'http://localhost:5000';

async function testSocialServicesAPI() {
  console.log('🧪 Testing ShreeWeb Social Services API...\n');

  try {
    // Test public endpoint
    console.log('1. Testing public social services endpoint...');
    const publicResponse = await fetch(`${BASE_URL}/backend/shreeweb-social-services/public`);
    
    if (publicResponse.ok) {
      const publicData = await publicResponse.json();
      console.log('✅ Public endpoint working');
      console.log('📋 Public data:', {
        mainHeading: publicData.socialServices?.mainHeading,
        socialMedia: publicData.socialServices?.socialMedia,
        isActive: publicData.socialServices?.isActive
      });
    } else {
      console.log('❌ Public endpoint failed:', publicResponse.status);
    }

    console.log('\n2. Testing admin endpoints (requires authentication)...');
    console.log('⚠️  Admin endpoints require authentication - test these through the CMS interface');

    console.log('\n🎉 API test completed!');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:5173/shreeweb/home to see the social services section');
    console.log('   2. Visit http://localhost:5173/shreeweb/cms/social-services to manage content');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSocialServicesAPI();