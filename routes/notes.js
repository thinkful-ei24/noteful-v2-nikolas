'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database

const knex = require('../knex');



// Get All (and search by query)
router.get('/', (req, res, next) => {
  const { searchTerm } = req.query;
  const { folderId } = req.query;
  const { tagId } = req.query; 
  knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName','tags.id as tagId','tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')

    .modify(function (queryBuilder) {
      if (searchTerm) {
        queryBuilder.where('title', 'like', `%${searchTerm}%`);
      }
    })
    .modify(function (queryBuilder) {
      if (folderId) {
        queryBuilder.where('folder_id', folderId);
      }
    })
    .modify(function (queryBuilder) {
      if (tagId) {
        queryBuilder.where('tags.id', tagId);
      }
    })
    .orderBy('notes.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

//knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName',
// 'tags.id as tagId', 'tags.name as tagName')
// .from('notes')
// .leftJoin('folders', 'notes.folder_id', 'folders.id')
// .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
// .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')


// Get a single item
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName','tags.id as tagId','tags.name as tagName')
    .from('notes')
    .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
    .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
    .where({'notes.id': id})
    .then(result => {
      console.log(result);
      res.status(200).json(result[0]);
    })
    .catch(err => {
      next(err);
    });
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const {title, content, folder_id, tag_id} = req.body;
  /***** Never trust users - validate input *****/
  const updateObj = {
    title,
    content,
    folder_id,
    tag_id
  };
 
  // updateableFields.forEach(field => {
  //   if (field in req.body) {
  //     updateObj[field] = req.body[field];
  //   }
  // });

  /***** Never trust users - validate input *****/
  if (!(updateObj.title)) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  let noteId;
 
  knex('notes')
    .where({'id': id})
    // .leftJoin('folders', 'notes.folder_id', 'folders.id')
    .update(updateObj)
    .returning('id')
    .then(() => {
      // noteId = resp.id;
      return knex
        .select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName','tags.id as tagId','tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', id);
    })
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));  
});



// Post (insert) an item
router.post('/', (req, res, next) => {
  const {title, content, folder_id, tag_id} = req.body; // Add `folderId` to object destructure

  console.log(req.body);
  /*
  REMOVED FOR BREVITY
  */
  const newItem = {
    title,
    content,
    folder_id,
    tag_id
  };

  let noteId;
  console.log(newItem);
  
  // Insert new note, instead of returning all the fields, just return the new `id`
  knex.insert(newItem)
    .into('notes')
    .returning('id')
    .then(([id]) => {
      noteId = id;
      // Using the new id, select the new note and the folder
      return knex.select('notes.id', 'title', 'content', 'folder_id as folderId', 'folders.name as folderName','tags.id as tagId','tags.name as tagName')
        .from('notes')
        .leftJoin('folders', 'notes.folder_id', 'folders.id')
        .leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
        .leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
        .where('notes.id', noteId);
    })
    .then(([result]) => {
      // console.log(`This is the ${result[0]}`);
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});


// Delete an item
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  knex('notes')
    .where({id: `${id}`})
    .del()
    .then(response => {
      res.sendStatus(204);
    }).catch(err => {
      next(err);
    });
});

module.exports = router;
