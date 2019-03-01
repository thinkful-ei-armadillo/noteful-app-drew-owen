const express = require("express");
const uuid = require("uuid/v4"); // to assign uuids for POST
const logger = require("../logger"); // connect to Winston
const { noteful } = require("../store");
const NotefulService = require("./noteful-service");
const xss = require("xss");
const path = require("path");

const notefulRouter = express.Router(); //
const bodyParser = express.json(); // support reading req.body (POST)

const serializeFolders = folder => {
  return {
    id: folder.id,
    name: xss(folder.folders_name)
  };
};

const serializeNotes = note => {
  return {
    id: note.id,
    name: xss(note.notes_name),
    content: xss(note.content),
    modified: xss(note.modified),
    folderId: note.folders_id
  }
}
notefulRouter
  .route("/folders")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotefulService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolders));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { name } = req.body;
    const newFolder = {
      folders_name: name
    };
    if (!name) {
      return res.status(400).send("Name is required.");
    }
    if (typeof name !== "string") {
      return res.status(400).send("Name must be type of string.");
    }
    NotefulService.insertFolders(knexInstance, newFolder).then(folder => {
      logger.info(`Folder named ${folder.folders_name} was created.`)
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${folder.id}`))
        .json(serializeFolders(folder));
    })
    .catch(next)
  });

notefulRouter
  .route("/folders/:folderId")
  .get((req, res) => {
    
  })
  .post(bodyParser, (req, res) => {
    // POST to noteful
  });

notefulRouter
  .route("/notes")
    .get((req, res, next) => {
      const knexInstance = req.app.get("db");
      NotefulService.getAllNotes(knexInstance)
        .then(notes => {
          res.json(notes.map(serializeNotes));
        })
        .catch(next);
  })
    .post((req, res, next) => {
    
  });

notefulRouter
  .route("/notes/:notesId")
  .get((req, res) => {
    // GET notefuls.notefulId
  })
  .delete((req, res) => {
    // DELETE notefuls.notefulId
  });

module.exports = notefulRouter;
