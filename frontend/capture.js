const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    console.log("Launching headless browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Load the local HTML file
    const fileUrl = 'file://' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');
    console.log("Navigating to", fileUrl);
    await page.goto(fileUrl, { waitUntil: 'networkidle0' });

    const topics = [
        'products', 'vectors', 'motion1d', 'projectile', 'calculus', 
        'overtaking', 'multiproj', 'relative-vel', 'carchase', 'rainman', 
        'practice-1', 'practice-2', 'vib-spring', 'vib-circular', 'vib-pendulum',
        'vib-waves', 'vib-interfere', 'vib-standing',
        'vib-surface', 'vib-doppler', 'vib-beats', 'vib-tubes', 'vib-em', 'vib-double-pendulum'
    ];

    for (let id of topics) {
        console.log('Capturing', id);
        
        // Ensure images directory exists
        const imgDir = path.join(__dirname, 'images');
        if (!fs.existsSync(imgDir)){
            fs.mkdirSync(imgDir);
        }

        // Click the nav link to show the page and trigger init scripts
        await page.evaluate((topicId) => {
            const link = document.querySelector(`a[data-page="${topicId}"]`);
            if(link) {
                // Also switch chapters if needed
                if (topicId.startsWith('vib-')) {
                    document.getElementById('chapter-select').value = 'vibrations';
                    document.getElementById('chapter-select').dispatchEvent(new Event('change'));
                } else {
                    document.getElementById('chapter-select').value = 'kinematics';
                    document.getElementById('chapter-select').dispatchEvent(new Event('change'));
                }
                link.click();
            }
        }, id);

        // Wait a bit for the canvas to draw
        await new Promise(r => setTimeout(r, 1000));

        // Let's screenshot the specific canvas for maximum clarity, or fallback to the wrapper
        // Special cases: Practice sets have multiple canvases or different layouts.
        let targetSelector = `#page-${id} canvas`;
        
        const canvasElement = await page.$(targetSelector);
        if (canvasElement) {
            await canvasElement.screenshot({ path: path.join(__dirname, 'images', `thumb_${id}.png`) });
            console.log(`Saved thumb_${id}.png`);
        } else {
            // Fallback for practice pages or others without a single main canvas
            const section = await page.$(`#page-${id} > div`);
            if (section) {
                await section.screenshot({ path: path.join(__dirname, 'images', `thumb_${id}.png`) });
                console.log(`Saved fallback thumb_${id}.png`);
            } else {
                console.log('Could not find element to screenshot for', id);
            }
        }
    }

    await browser.close();
    console.log('All screenshots captured!');
})();
