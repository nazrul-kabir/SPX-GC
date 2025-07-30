
// -----------------------------------------
// Handle Express server routes for the API (at "/api/")
// -----------------------------------------
var express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const directoryPath = path.normalize(config.general.dataroot);
const logger = require('../utils/logger');
logger.debug('API-route loading...');
const spx = require('../utils/spx_server_functions.js');
const xlsx = require('node-xlsx').default;

// --- WATCHOUT!!!! v1.3.3 disabled --------
// const { now } = require("moment");
// const { constants } = require("buffer");

// ROUTES -------------------------------------------------------------------------------------------
router.get('/', function (req, res) {
  res.send('Looking for this <a href="/api/v1/">api/v1</a>?');
});


const apiHandler = require('../utils/api-handlers.js');
router.get('/files', async (req, res) => {
  // Get files
  const fileListAsJSON = await apiHandler.GetDataFiles(req, res);
  res.send(fileListAsJSON);
}); // file


router.get('/initRemCntrRenderer', apiHandler.initRemCntrRenderer);
router.get('/openFileFolder/', apiHandler.openFileFolder);
router.get('/licBasic/', apiHandler.licBasic);
router.get('/rotBasic/', apiHandler.rotBasic);
router.get('/logger/', apiHandler.loggerGet);
router.post('/logger/', apiHandler.loggerPost);
router.post('/browseFiles/', apiHandler.browseFiles);
router.post('/heartbeat/', apiHandler.heartbeat);
router.post('/readExcelData', apiHandler.readExcelData);
router.post('/savefile/:filebasename', apiHandler.savefile);
router.post('/saverundownfile/:projectName/:rundownName', apiHandler.saverundownfile);
router.post('/exportCSVfile', apiHandler.exportCSVfile);


module.exports = router;