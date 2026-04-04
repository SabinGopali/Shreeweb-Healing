import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testShreeWebAboutAPI() {
  console.log('🧪 Testing ShreeWeb About API...\n');

  try {
    // Test GET endpoint
    console.log('📥 Testing GET /backend/shreeweb-about');
    const getResponse = await fetch(`${BASE_URL}/backend/shreeweb-about`);
    const getData = await getResponse.json();
    
    if (getResponse.ok && getData.success) {
      console.log('✅ GET request successful');
      console.log('📊 Data structure:', {
        hasHero: !!getData.data?.hero,
        hasWhatWeDo: !!getData.data?.whatWeDo,
        hasPhilosophy: !!getData.data?.philosophy,
        hasHowToStart: !!getData.data?.howToStart,
        hasCallToAction: !!getData.data?.callToAction,
        isActive: getData.data?.isActive,
        lastUpdated: getData.data?.lastUpdated
      });
    } else {
      console.log('❌ GET request failed:', getData.message);
      return;
    }

    // Test PUT endpoint for hero section
    console.log('\n📤 Testing PUT /backend/shreeweb-about/section/hero');
    const heroUpdate = {
      title: 'JAPANDI TEST',
      subtitle: 'Energy Sessions Updated',
      description: 'Test update from API script'
    };

    const putResponse = await fetch(`${BASE_URL}/backend/shreeweb-about/section/hero`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(heroUpdate)
    });

    const putData = await putResponse.json();
    
    if (putResponse.ok && putData.success) {
      console.log('✅ PUT request successful');
      console.log('📝 Updated hero title:', putData.data?.hero?.title);
    } else {
      console.log('❌ PUT request failed:', putData.message);
    }

    // Verify the update
    console.log('\n🔍 Verifying update...');
    const verifyResponse = await fetch(`${BASE_URL}/backend/shreeweb-about`);
    const verifyData = await verifyResponse.json();
    
    if (verifyResponse.ok && verifyData.success) {
      console.log('✅ Verification successful');
      console.log('📝 Current hero title:', verifyData.data?.hero?.title);
      
      if (verifyData.data?.hero?.title === 'JAPANDI TEST') {
        console.log('🎉 Update was persisted correctly!');
      } else {
        console.log('⚠️  Update may not have been persisted');
      }
    }

    console.log('\n✨ ShreeWeb About API test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.error('🔧 Make sure the backend server is running on port 5000');
  }
}

// Run the test
testShreeWebAboutAPI();