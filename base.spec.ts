// This file will load all the test config variables

import * as nconf from 'nconf';

nconf.argv().env().file({ file: './config/test.json' });
nconf.defaults(require('./config/default'));