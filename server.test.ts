import * as test from 'tape';

const request = require('supertest');

const setup = () => {
  process.env.PORT = 9999;    // Use a unique port
  return require('./server'); // Get server.js so we can start a server in the next tests
};

const close = () => {
  process.exit(0);
};

test('Testing page calls', (t) => {
  let server = setup();

  request(server)
    .get('/')
    .expect(200)
    .end((err, res) => {
      if (err) {
        t.error(err, 'Call to / failed');
      }
      
      t.equal(200, res.statusCode, 'Test Existing page');
    });

  request(server)
    .get('/doesnotexist')
    .expect(404)
    .end((err, res) => {
      if (err) {
        t.error(err, 'Call to /doesnotexist failed');
      }

      t.equal(404, res.statusCode, 'Test 404 page');

      t.end(); // end the test
      close(); // close the connection
    });
});
