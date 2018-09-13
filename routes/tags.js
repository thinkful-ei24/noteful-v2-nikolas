'use strict';

const express = require('express');
const knex = require('../knex');
const router = express.Router();

router.get('/', (req, res, next) => {
  knex('tags')
    .select('name', 'id')
    .returning(['name', 'id'])
    .orderBy('name')
    .then(results => res.json(results))
    .catch(err => res.json(err));
});

router.get('/:id', (req, res, next) => {

  const { id } = req.params;

  knex('tags')
    .select('name', 'id')
    .where({'id': id})
    .returning(['name'])
    .then(([response]) => {
      res.json(response);
    })
    .catch(err =>
    {
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  

  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newValues = {
    'name': name
  };

  knex('tags')
    .where({'id': id})
    .update(newValues)
    .returning(['name', 'id'])
    .then(resp => res.json(resp))
    .catch(err => {
      next(err);
    });
});

router.post('/', (req, res, next) => {
  const { name } = req.body;
  
  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };
  
  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      // Uses Array index solution to get first item in results array
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  knex('tags')
    .where({'id': id})
    .del()
    .then(resp => res.status(204).json(resp))
    .catch(err => {
      next(err);
    });
});
  

module.exports = router;