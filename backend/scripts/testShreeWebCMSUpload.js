#!/usr/bin/env node

/**
 * Test script for ShreeWeb CMS upload endpoint
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/backend/shreeweb-cms';

async function testUploadEndpoint() {
  console.log('\n🔍 Testing ShreeWeb CMS upload endpoint...');
  
  try {
    // Test without authentication (should fail)
    const response = await fetch(`${API_BASE}/upload-image`, {
      method: 'POST',
      body: new FormData() // Empty form data
    });
    
    if (response.status === 401) {
      console.log('✅ Upload endpoint properly protected (401 Unauthorized)');
    } else {
      console.log('❌ Upload endpoint should be protected:', response.status);
    }
  } catch (error) {
    console.log('❌ Upload endpoint error:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing ShreeWeb CMS upload endpoint...');
  
  await testUploadEndpoint();
  
  console.log('\n✨ Test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Login to ShreeWeb CMS at http://localhost:5173/shreeweb/cms-login');
  console.log('2. Try uploading a video at http://localhost:5173/shreeweb/cms/hero-section');
}

main().catch(console.error);