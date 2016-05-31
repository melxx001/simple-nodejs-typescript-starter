import * as test from 'tape';
import * as utils from './index';

test('Utils Test', (t) => {

  // Logger Tests
  let logger = utils.Logger;
  if (!logger) {
    t.error('logger is undefined');
  } else {
    t.equal(typeof logger, 'object', 'Check if logger object exists');
    t.equal(typeof logger.debug, 'function', 'Check if logger function debug() exists');
    t.equal(typeof logger.info, 'function', 'Check if logger function info() exists');
    t.equal(typeof logger.warn, 'function', 'Check if logger function warn() exists');
    t.equal(typeof logger.error, 'function', 'Check if logger function error() exists');
  }

  // Debug function test
  let debug = utils.Debug;
  if (!debug) {
    t.error('debug is undefined');
  } else {
    t.equal(typeof debug, 'function', 'Check if debug function exists');
  }

  t.end(); // end the test
});
