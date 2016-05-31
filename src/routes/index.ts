'use strict';
import * as express from 'express';
const router = express.Router();

// initial route
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/test/:name', (req, res) => {
  res.render('index', {
    param: req.params.name
  });
});

export = router;
