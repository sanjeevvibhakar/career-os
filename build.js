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

console.log('3. Setting up SPA routing fallback...');
// Cloudflare Workers with static assets uses wrangler.json not_found_handling = "single-page-application"
// Ensure no problematic _redirects file exists that conflicts with wrangler
const redirectsPath = path.join(frontendDist, '_redirects');
if (fs.existsSync(redirectsPath)) {
  fs.rmSync(redirectsPath, { force: true });
}

if (fs.existsSync(rootDist)) {
  fs.rmSync(rootDist, { recursive: true, force: true });
}
fs.cpSync(frontendDist, rootDist, { recursive: true });

console.log('✓ Build and dist copy complete!');
