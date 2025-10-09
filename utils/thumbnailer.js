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

  // Wait for the template to signal that it is ready for a screenshot
  try {
    await page.waitForSelector('body[data-spx-thumbnail-ready="true"]', { timeout: 10000 });
  } catch (error) {
    console.error(`Timeout waiting for template signal: ${templatePath}`);
    await browser.close();
    throw new Error(`Timeout waiting for template to be ready: ${templatePath}`);
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