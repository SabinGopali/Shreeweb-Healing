import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const fixApiCalls = async () => {
  console.log('🔍 Finding and fixing API calls in React components...\n');
  
  const files = await glob('shreeweb/src/**/*.{js,jsx,ts,tsx}', {
    ignore: ['**/node_modules/**']
  });
  
  let fixedCount = 0;
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Remove localhost:3000 from all API calls
    content = content.replace(/https?:\/\/localhost:3000/g, '');
    content = content.replace(/https?:\/\/localhost:3000\//g, '/');
    
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Fixed ${fixedCount} files!`);
  console.log('\n📝 Example:');
  console.log('   Before: fetch("http://localhost:3000/backend/clarity-section")');
  console.log('   After:  fetch("/backend/clarity-section")');
};

fixApiCalls().catch(console.error);