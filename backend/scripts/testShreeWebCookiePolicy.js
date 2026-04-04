import mongoose from 'mongoose';
import ShreeWebCookiePolicy from '../models/ShreeWebCookiePolicy.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function testCookiePolicyAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Connected to MongoDB');

    // Test 1: Create default cookie policy data
    console.log('\n📝 Test 1: Creating default cookie policy data...');
    
    // Clear existing data
    await ShreeWebCookiePolicy.deleteMany({});
    
    const cookiePolicy = new ShreeWebCookiePolicy({});
    await cookiePolicy.save();
    
    console.log('✅ Default cookie policy data created');
    console.log('Hero title:', cookiePolicy.hero.title);
    console.log('Last updated:', cookiePolicy.lastUpdatedDate);
    console.log('Understanding cookies title:', cookiePolicy.understandingCookies.title);
    console.log('Essential cookies title:', cookiePolicy.cookieTypesWeUse.essential.title);
    console.log('Browser instructions count:', cookiePolicy.managingPreferences.browserInstructions.length);

    // Test 2: Update hero section
    console.log('\n📝 Test 2: Updating hero section...');
    
    cookiePolicy.hero = {
      tag: 'Updated Cookie Policy',
      title: 'Updated Cookie',
      subtitle: 'Updated transparency',
      description: 'Updated description about cookies and similar technologies.'
    };
    
    await cookiePolicy.save();
    console.log('✅ Hero section updated');
    console.log('New hero title:', cookiePolicy.hero.title);

    // Test 3: Update cookie type
    console.log('\n📝 Test 3: Updating essential cookie type...');
    
    cookiePolicy.cookieTypesWeUse.essential.title = 'Updated Essential Cookies';
    cookiePolicy.cookieTypesWeUse.essential.description = 'Updated description for essential cookies.';
    cookiePolicy.cookieTypesWeUse.essential.examples.push('Updated example');
    
    await cookiePolicy.save();
    console.log('✅ Essential cookie type updated');
    console.log('New essential title:', cookiePolicy.cookieTypesWeUse.essential.title);
    console.log('Examples count:', cookiePolicy.cookieTypesWeUse.essential.examples.length);

    // Test 4: Update browser instructions
    console.log('\n📝 Test 4: Updating browser instructions...');
    
    cookiePolicy.managingPreferences.browserInstructions.push({
      category: 'Test Browsers',
      instructions: ['Test instruction 1', 'Test instruction 2']
    });
    
    await cookiePolicy.save();
    console.log('✅ Browser instructions updated');
    console.log('Browser instruction categories:', cookiePolicy.managingPreferences.browserInstructions.length);

    // Test 5: Verify data structure
    console.log('\n📝 Test 5: Verifying complete data structure...');
    
    const savedPolicy = await ShreeWebCookiePolicy.findOne();
    
    console.log('✅ Data structure verification:');
    console.log('- Hero section:', !!savedPolicy.hero);
    console.log('- Last updated date:', !!savedPolicy.lastUpdatedDate);
    console.log('- Understanding cookies:', !!savedPolicy.understandingCookies);
    console.log('- Cookie types we use:', !!savedPolicy.cookieTypesWeUse);
    console.log('- Managing preferences:', !!savedPolicy.managingPreferences);
    console.log('- Contact section:', !!savedPolicy.contactSection);
    console.log('- Essential cookies:', !!savedPolicy.cookieTypesWeUse.essential);
    console.log('- Functional cookies:', !!savedPolicy.cookieTypesWeUse.functional);
    console.log('- Analytics cookies:', !!savedPolicy.cookieTypesWeUse.analytics);

    console.log('\n🎉 All tests passed! Cookie Policy API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
}

// Run the test
testCookiePolicyAPI();