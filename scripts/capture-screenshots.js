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
    viewport: { width: 1280, height: 800 },
    async setup(page) {
      await page.waitForTimeout(2000);
    },
  },
  {
    name: 'py-ron',
    url: 'https://onigiri.zone/py-ron/',
    filename: 'py-ron.png',
    viewport: { width: 1280, height: 800 },
    async setup(page) {
      // Wait for the button and click it to generate an image
      await page.waitForSelector('button#refresh-btn');
      console.log('  Generating Ron Swanson quote...');
      await page.click('button#refresh-btn');

      // Wait for the image to appear (the img element becomes visible)
      await page.waitForSelector('#image', { state: 'visible', timeout: 30000 });
      console.log('  Quote generated!');

      // Give it a moment to fully render
      await page.waitForTimeout(1000);
    },
  },
  {
    name: 'a-box-of-mac-and-cheese',
    url: 'https://onigiri.zone/a-box-of-mac-and-cheese/',
    filename: 'a-box-of-mac-and-cheese.png',
    viewport: { width: 1280, height: 800 },
    async setup(page) {
      // Inject the correct config before any scripts run
      await page.addInitScript(() => {
        window.CONFIG = {
          API_INIT_ENDPOINT: 'https://2gotexgdyd.execute-api.us-east-1.amazonaws.com/default/aBoxOfMacAndCheeseInit',
          API_STATUS_ENDPOINT: 'https://mcvwsqrip4.execute-api.us-east-1.amazonaws.com/default/aBoxOfMacAndCheeseStatus',
          POLL_INTERVAL_MS: 3000,
          MAX_POLLS: 60,
          ENVIRONMENT: 'dev'
        };
      });

      // Listen for console messages to debug
      page.on('console', msg => console.log('  Browser console:', msg.text()));

      // Wait for the generate button and click it
      await page.waitForSelector('button:has-text("Generate")');
      console.log('  Generating book cover...');
      await page.click('button:has-text("Generate")');

      try {
        // Wait for the image to appear (when status text hides and image shows)
        // Book cover generation uses AWS Bedrock which can take 30-60 seconds
        await page.waitForSelector('#image', { state: 'visible', timeout: 120000 });
        console.log('  Book cover generated!');

        // Give it a moment to fully render
        await page.waitForTimeout(1000);
      } catch (error) {
        // If generation fails/times out, just take a screenshot of the current state
        console.log('  Generation timed out, capturing current state');
        await page.waitForTimeout(2000);
      }
    },
  },
  {
    name: 'adnd',
    url: 'https://onigiri.zone/cleric/sheet.html',
    filename: 'adnd.png',
    viewport: { width: 900, height: 800 },  // Narrower to eliminate whitespace
    async setup(page) {
      await page.waitForTimeout(2000);
    },
  },
];

async function captureScreenshots() {
  const outputDir = path.join(__dirname, '../public/screenshots');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();

  for (const project of projects) {
    console.log(`Capturing screenshot of ${project.name}...`);

    // Create a new context with project-specific viewport
    const context = await browser.newContext({
      viewport: project.viewport,
    });

    const page = await context.newPage();

    try {
      await page.goto(project.url, { waitUntil: 'networkidle' });

      // Run project-specific setup (e.g., click generate button)
      if (project.setup) {
        await project.setup(page);
      }

      const screenshotPath = path.join(outputDir, project.filename);
      await page.screenshot({ path: screenshotPath, fullPage: false });
      console.log(`✓ Saved to ${project.filename}`);
    } catch (error) {
      console.error(`✗ Failed to capture ${project.name}:`, error.message);
    } finally {
      await context.close();
    }
  }

  await browser.close();
  console.log('\nAll screenshots captured!');
}

captureScreenshots().catch(console.error);
