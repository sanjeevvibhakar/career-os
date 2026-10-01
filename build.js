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

console.log('3. Setting up SPA routing fallbacks (_redirects & 404.html)...');
const indexHtml = path.join(frontendDist, 'index.html');
const fallback404 = path.join(frontendDist, '404.html');
if (fs.existsSync(indexHtml)) {
  fs.copyFileSync(indexHtml, fallback404);
}

if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(frontendDist, rootDist, { recursive: true });

console.log('✓ Build, 404 fallback, and dist copy complete!');
