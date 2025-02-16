import fs from 'fs/promises';
import path from 'path';

const CONTENT_DIR = 'content-to-import';
const OUTPUT_DIR = 'src/content';

async function importContent() {
  try {
    // Create necessary directories
    await fs.mkdir(path.join(OUTPUT_DIR, 'notes'), { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'writeups'), { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'projects'), { recursive: true });

    // Import notes
    const noteSections = [
      'web-security', 'network-security', 'malware-analysis',
      'reverse-engineering', 'cloud-security', 'mobile-security',
      'cryptography', 'osint', 'red-teaming'
    ];

    for (const section of noteSections) {
      await fs.mkdir(path.join(OUTPUT_DIR, 'notes', section), { recursive: true });
    }

    console.log('✅ Content directories created successfully');
    console.log('\nTo import your content:');
    console.log('1. Create a "content-to-import" directory in the project root');
    console.log('2. Organize your markdown files in the following structure:');
    console.log(`
   content-to-import/
   ├── notes/
   │   ├── web-security/
   │   ├── network-security/
   │   └── ...
   ├── writeups/
   └── projects/
    `);
    console.log('3. Run this script again to import the content');

  } catch (error) {
    console.error('Error:', error);
  }
}

importContent();