const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const spx = require('./spx_server_functions.js');

async function generate(templatePath) {
  const templateFullPath = path.join(spx.getStartUpFolder(), 'ASSETS', 'templates', templatePath);
  const thumbnailUrl = `file://${templateFullPath}`;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(thumbnailUrl, { waitUntil: 'networkidle0' });

  // Wait for a ready signal from the template.
  // If the signal is not received within a short timeout, fall back to a fixed delay.
  // This ensures backward compatibility with older templates.
  try {
    // Wait for the ready signal for a short period (e.g., 250ms).
    await page.waitForSelector('body[data-spx-thumbnail-ready="true"]', { timeout: 250 });
    // console.log(`Ready signal detected for ${templatePath}.`); // Optional: for debugging
  } catch (error) {
    // If it's a timeout error, it means the signal wasn't found.
    if (error.name === 'TimeoutError') {
      // console.log(`No ready signal for ${templatePath}, falling back to 1-second delay.`); // Optional: for debugging
      // Fallback to a fixed delay (e.g., 1000ms).
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // For any other errors, re-throw them.
      console.error(`An unexpected error occurred while generating thumbnail for ${templatePath}:`, error);
      await browser.close();
      throw error;
    }
  }

  const templateDir = path.dirname(templateFullPath);
  const thumbnailDir = path.join(templateDir, 'thumbnails');
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }

  const thumbnailPath = path.join(thumbnailDir, 'thumbnail.png');
  await page.screenshot({ path: thumbnailPath });

  await browser.close();

  const thumbnailWebPath = path.join(path.dirname(templatePath), 'thumbnails', 'thumbnail.png').replace(/\\/g, '/');
  return thumbnailWebPath;
}

module.exports = {
  generate,
};