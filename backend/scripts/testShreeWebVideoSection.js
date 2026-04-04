import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

const testVideoSectionAPI = async () => {
  console.log('🧪 Testing ShreeWeb Video Section API...\n');

  try {
    // Test GET endpoint
    console.log('1. Testing GET /backend/shreeweb-video-section');
    const getResponse = await fetch(`${BASE_URL}/backend/shreeweb-video-section`);
    const getData = await getResponse.json();
    
    console.log('Status:', getResponse.status);
    console.log('Response:', JSON.stringify(getData, null, 2));
    console.log('✅ GET test completed\n');

    if (getData.success && getData.data) {
      // Test UPDATE endpoint
      console.log('2. Testing PUT /backend/shreeweb-video-section');
      const updateData = {
        ...getData.data,
        title: 'Updated: Your next level of success may require more than strategy.',
        description: 'Updated: Through structured sessions using Pranic Healing, I help entrepreneurs and ambitious professionals clear energetic blockages, restore balance, and strengthen their internal capacity for growth.',
        cta1Text: 'Updated: Schedule a Discovery Call',
        cta2Text: 'Updated: Book a Session',
        socialLinks: [
          { name: 'Facebook', url: 'https://facebook.com/updated' },
          { name: 'Instagram', url: 'https://instagram.com/updated' },
          { name: 'LinkedIn', url: 'https://linkedin.com/company/updated' }
        ]
      };

      const putResponse = await fetch(`${BASE_URL}/backend/shreeweb-video-section`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const putData = await putResponse.json();
      console.log('Status:', putResponse.status);
      console.log('Response:', JSON.stringify(putData, null, 2));
      console.log('✅ PUT test completed\n');
    }

    // Test CREATE endpoint
    console.log('3. Testing POST /backend/shreeweb-video-section');
    const createData = {
      videoImage: '/test-image.jpg',
      youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1',
      youtubeRedirectUrl: 'https://youtu.be/dQw4w9WgXcQ',
      title: 'Test Video Section Title',
      description: 'Test video section description with <strong>HTML</strong> content.',
      cta1Text: 'Test CTA 1',
      cta2Text: 'Test CTA 2',
      cta1Link: '/test/link1',
      cta2Link: '/test/link2',
      socialLinks: [
        { name: 'YouTube', url: 'https://youtube.com/test' },
        { name: 'Twitter', url: 'https://twitter.com/test' }
      ]
    };

    const postResponse = await fetch(`${BASE_URL}/backend/shreeweb-video-section`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createData),
    });

    const postData = await postResponse.json();
    console.log('Status:', postResponse.status);
    console.log('Response:', JSON.stringify(postData, null, 2));
    console.log('✅ POST test completed\n');

    // Final GET to verify changes
    console.log('4. Final GET to verify changes');
    const finalResponse = await fetch(`${BASE_URL}/backend/shreeweb-video-section`);
    const finalData = await finalResponse.json();
    
    console.log('Status:', finalResponse.status);
    console.log('Final data:', JSON.stringify(finalData, null, 2));
    console.log('✅ Final verification completed\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testVideoSectionAPI();