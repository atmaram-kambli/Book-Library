var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource user');
});
router.get('/cool', function(req, res, next) {
  res.send('You are xo cool!');
});

module.exports = router;
