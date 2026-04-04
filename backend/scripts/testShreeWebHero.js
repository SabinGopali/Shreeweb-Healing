#!/usr/bin/env node

/**
 * Test script for ShreeWeb Hero API endpoints
 * Tests both public and admin endpoints
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3000/backend/shreeweb-hero';

async function testPublicEndpoint() {
  console.log('\n🔍 Testing public hero endpoint...');
  
  try {
    const response = await fetch(`${API_BASE}/active`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Public endpoint working');
      console.log('📄 Hero data:', {
        title: data.hero.title,
        subtitle: data.hero.subtitle,
        ctaText: data.hero.ctaText,
        backgroundType: data.hero.backgroundType,
        backgroundImage: data.hero.backgroundImage,
        backgroundVideo: data.hero.backgroundVideo
      });
    } else {
      console.log('❌ Public endpoint failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Public endpoint error:', error.message);
  }
}

async function testAdminEndpoint() {
  console.log('\n🔍 Testing admin hero endpoint (without auth)...');
  
  try {
    const response = await fetch(`${API_BASE}/`);
    const data = await response.json();
    
    if (response.status === 401) {
      console.log('✅ Admin endpoint properly protected (401 Unauthorized)');
    } else if (response.ok && data.success) {
      console.log('✅ Admin endpoint working');
      console.log('📄 Hero data:', {
        title: data.hero.title,
        subtitle: data.hero.subtitle,
        ctaText: data.hero.ctaText
      });
    } else {
      console.log('❌ Admin endpoint failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Admin endpoint error:', error.message);
  }
}

async function testUpdateEndpoint() {
  console.log('\n🔍 Testing update endpoint (without auth)...');
  
  try {
    const response = await fetch(`${API_BASE}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'TEST TITLE',
        subtitle: 'Test subtitle',
        backgroundType: 'video',
        backgroundVideo: '/test-video.mp4'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ Update endpoint properly protected (401 Unauthorized)');
    } else {
      const data = await response.json();
      console.log('❌ Update endpoint should be protected:', data);
    }
  } catch (error) {
    console.log('❌ Update endpoint error:', error.message);
  }
}

async function main() {
  console.log('🚀 Testing ShreeWeb Hero API endpoints...');
  
  await testPublicEndpoint();
  await testAdminEndpoint();
  await testUpdateEndpoint();
  
  console.log('\n✨ Test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Visit http://localhost:5173/shreeweb/home to see the hero section');
  console.log('2. Visit http://localhost:5173/shreeweb/cms/hero-section to manage content (admin login required)');
}

main().catch(console.error);