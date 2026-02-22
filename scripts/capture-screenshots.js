#!/usr/bin/env node

/**
 * Script to capture screenshots of projects for the portfolio
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const projects = [
  {
    name: 'thirsty',
    url: 'https://thirsty.onigiri.zone',
    filename: 'thirsty.png',
  },
  {
    name: 'py-ron',
    url: 'https://onigiri.zone/py-ron/',
    filename: 'py-ron.png',
    waitFor: 'button#refresh-btn',
  },
  {
    name: 'a-box-of-mac-and-cheese',
    url: 'https://onigiri.zone/a-box-of-mac-and-cheese/',
    filename: 'a-box-of-mac-and-cheese.png',
  },
  {
    name: 'adnd',
    url: 'https://onigiri.zone/cleric/sheet.html',
    filename: 'adnd.png',
  },
];

async function captureScreenshots() {
  const outputDir = path.join(__dirname, '../public/screenshots');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  for (const project of projects) {
    console.log(`Capturing screenshot of ${project.name}...`);
    const page = await context.newPage();

    try {
      await page.goto(project.url, { waitUntil: 'networkidle' });

      // Wait for specific element if specified
      if (project.waitFor) {
        await page.waitForSelector(project.waitFor, { timeout: 5000 });
      } else {
        // Wait a bit for any animations/dynamic content
        await page.waitForTimeout(2000);
      }

      const screenshotPath = path.join(outputDir, project.filename);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✓ Saved to ${project.filename}`);
    } catch (error) {
      console.error(`✗ Failed to capture ${project.name}:`, error.message);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('\nAll screenshots captured!');
}

captureScreenshots().catch(console.error);
