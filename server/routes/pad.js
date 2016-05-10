var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pad');
});

router.get('/:room([A-Za-z0-9]{10})', function(req, res, next) {
  res.render('pad');
});

router.get('/pad', function(req, res, next) {
  res.render('pad');
});

router.get('/pad/:room([A-Za-z0-9]{10})', function(req, res, next) {
  res.render('pad');
});

module.exports = router;