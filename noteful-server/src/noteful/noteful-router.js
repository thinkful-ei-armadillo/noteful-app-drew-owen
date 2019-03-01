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
  };
};
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
    NotefulService.insertFolders(knexInstance, newFolder)
      .then(folder => {
        logger.info(`Folder named ${folder.folders_name} was created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolders(folder));
      })
      .catch(next);
  });

notefulRouter
  .route("/folders/:folderId")
  .delete(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { folderId } = req.params;
    NotefulService.getFolderById(knexInstance, folderId).then(folder => {
      if (!folder) {
        logger.info(`Folder not found with id ${folderId}.`);
        return res.status(404).json({
          error: {
            message: "Folder not found."
          }
        });
      }
    });
    NotefulService.deleteFolder(knexInstance, folderId)
      .then(numRowsAffected => {
        logger.info(`Folder with id ${folderId} deleted.`);
        res.status(204).end();
      })
      .catch(next);
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
  .post(bodyParser, (req, res, next) => {
    const knexInstance = req.app.get("db");
    const { name, content, folderId } = req.body;
    const newNote = {
      notes_name: name,
      content,
      folders_id: folderId
    };
    for (const field of ["notes_name", "content", "folders_id"]) {
      if (!newNote[field]) {
        logger.info(`${field} is required.`);
        return res.status(400).send(`${field} is required.`);
      }
    }
    if (typeof name !== "string") {
      logger.info(`Name: ${name} must be typeof string.`);
      return res.status(400).send(`Name: ${name} must be typeof string.`);
    }
    if (typeof content !== "string") {
      logger.info(`Content: ${content} must be typeof string.`);
      return res.status(400).send(`Content: ${content} must be typeof string.`);
    }
    if (typeof folderId !== "string") {
      logger.info(`Folder ID: ${folderId} must be typeof string.`);
      return res
        .status(400)
        .send(`Folder ID: ${folderId} must be typeof string.`);
    }
    NotefulService.insertNotes(knexInstance, newNote)
      .then(note => {
        logger.info(`Note named ${note.notes_name} was created.`);
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNotes(note));
      })
      .catch(next);
  });

notefulRouter.route("/notes/:noteId").delete((req, res, next) => {
  const knexInstance = req.app.get("db");
  const { noteId } = req.params;
  NotefulService.getNoteById(knexInstance, noteId).then(note => {
    if (!note) {
      logger.info(`Note not found with id ${noteId}.`);
      return res.status(404).json({
        error: {
          message: "Note not found."
        }
      });
    }
    next();
  })
    .catch(next);
  NotefulService.deleteNote(knexInstance, noteId)
  .then(numRowsAffected => {
    logger.info(`Note with id ${noteId} deleted.`);
    res.status(204).end();
  })
  .catch(next);
});

module.exports = notefulRouter;
