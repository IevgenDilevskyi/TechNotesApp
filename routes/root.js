const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req, res) => { // serve index.html when hitting / or /index or /index.html
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
});

module.exports = router; // export router so it can be used in server.js
