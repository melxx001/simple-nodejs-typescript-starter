'use strict';
import * as express from 'express';
const router = express.Router();
import {CustomRequest, CustomResponse} from '../utils/interfaces';

// initial route
router.get('/', (req: CustomRequest, res: CustomResponse) => {
  res.render('index');
});

router.get('/test/:name', (req: CustomRequest, res: CustomResponse) => {
  res.render('index', {
    param: req.params.name
  });
});

export = router;
