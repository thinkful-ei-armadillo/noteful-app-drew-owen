const express = require('express');
const uuid = require('uuid/v4'); // to assign uuids for POST
const logger = require('../logger'); // connect to Winston
const { resource1s } = require('../store');

const resource1Router = express.Router(); //
const bodyParser = express.json(); // support reading req.body (POST)

resource1Router
  .route('/resource1')
  .get((req, res) => {
    // GET resource1
  })
  .post(bodyParser, (req, res) => {
    // POST to resource1
  });

resource1Router
  .route('/resource1/:resource1Id')
  .get((req, res) => {
    // GET resource1s.resource1Id
  })
  .delete((req, res) => {
    // DELETE resource1s.resource1Id
  });

module.exports = resource1Router;
