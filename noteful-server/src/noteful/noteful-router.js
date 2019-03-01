const express = require('express');
const uuid = require('uuid/v4'); // to assign uuids for POST
const logger = require('../logger'); // connect to Winston
const { noteful } = require('../store');
const NotefulService = require('./noteful-service');
const xss = require('xss');

const notefulRouter = express.Router(); //
const bodyParser = express.json(); // support reading req.body (POST)

const serializeFolders = folder => {
  return {
    id: folder.id,
    name: xss(folder.folders_name)
  };
};

notefulRouter
  .route('/folders')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    NotefulService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolders));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res) => {
    // POST to noteful
  });

notefulRouter
  .route('/folders/:folderId')
  .get((req, res) => {
    // GET noteful
  })
  .post(bodyParser, (req, res) => {
    // POST to noteful
  });

notefulRouter
  .route('/notes')
  .get((req, res) => {
    // GET notefuls.notefulId
  })
  .delete((req, res) => {
    // DELETE notefuls.notefulId
  });

notefulRouter
  .route('/notes/:notesId')
  .get((req, res) => {
    // GET notefuls.notefulId
  })
  .delete((req, res) => {
    // DELETE notefuls.notefulId
  });

module.exports = notefulRouter;
