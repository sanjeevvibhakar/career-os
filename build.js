const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Career OS Root Build Triggered ---');

const frontendDir = path.join(__dirname, 'frontend');
const rootDist = path.join(__dirname, 'dist');
const frontendDist = path.join(frontendDir, 'dist');

console.log('1. Installing frontend dependencies...');
execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });

console.log('2. Building frontend...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

console.log('3. Copying dist files to root for Cloudflare/Vercel compatibility...');
if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(frontendDist, rootDist, { recursive: true });

console.log('✓ Build and dist copy complete!');
