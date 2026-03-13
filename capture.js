const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
    console.log('Starting Puppeteer with Edge...');
    
    // Default Edge paths
    const edgePaths = [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
    ];
    
    let executablePath = edgePaths.find(p => fs.existsSync(p));
    if (!executablePath) {
        throw new Error('Could not find Microsoft Edge installation');
    }

    const browser = await puppeteer.launch({ 
        executablePath,
        headless: "new"
    });
    
    const page = await browser.newPage();
    const url = 'http://localhost:3000';
    console.log(`Navigating to ${url}...`);
    
    // Wait until network is idle
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Make sure 'screenshots' dir exists
    const screenshotsDir = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir);
    }

    // 1. Mobile (375px)
    console.log('Capturing mobile...');
    await page.setViewport({ width: 375, height: 812 });
    await page.screenshot({ path: path.join(screenshotsDir, 'mobile.png'), fullPage: true });

    // 2. Tablet (768px)
    console.log('Capturing tablet...');
    await page.setViewport({ width: 768, height: 1024 });
    await page.screenshot({ path: path.join(screenshotsDir, 'tablet.png'), fullPage: true });

    // 3. Desktop (1024px)
    console.log('Capturing desktop...');
    await page.setViewport({ width: 1024, height: 768 });
    await page.screenshot({ path: path.join(screenshotsDir, 'desktop.png'), fullPage: true });

    console.log('All screenshots captured successfully!');
    await browser.close();
}

capture().catch(err => {
    console.error('Error capturing screenshots:', err);
    process.exit(1);
});
