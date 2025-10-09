const express = require('express');
const router = express.Router();
const thumbnailer = require('../utils/thumbnailer');

router.post('/thumbnail', async (req, res) => {
  const templatePath = req.body.templatePath;
  if (!templatePath) {
    return res.status(400).send('Template path is required.');
  }

  try {
    const thumbnail = await thumbnailer.generate(templatePath);
    res.json({ thumbnailUrl: thumbnail });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).send('Error generating thumbnail.');
  }
});

module.exports = router;