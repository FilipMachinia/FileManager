const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/getAllFiles', function (req, res, next) {

  fs.readFile('routes/allFiles.json', 'utf8', function (err, data) {
    if (err) throw err;
    res.status(200).send(data)
  })
});

module.exports = router;
