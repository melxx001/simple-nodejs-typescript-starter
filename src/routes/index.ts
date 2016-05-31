'use strict';
import * as express from 'express';

const router = express.Router();

// initial route
router.get('/', function(req, res) {
  res.render('index');
});

router.get('/:name', function(req, res) {
  res.render('index', {
    param: req.params.name
  });
});

export = router;
