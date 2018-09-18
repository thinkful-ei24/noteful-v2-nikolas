'use strict';

module.exports = {
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://dev@localhost/noteful-app',
    debug: true, // http://knexjs.org/#Installation-debug
    pool: { min: 1, max: 2 }
  },
  test: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL || 'postgres://dev@localhost/noteful-test',
    pool: { min: 1, max: 2 }
  }
};

//create a dev and test environment 