const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});


router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  
  knex
    .first(`id`, 'name')
    .from('folders')
    .where(`id`, id)
    .then(results => {
      console.log(results)
      res.json(results);
    })
    .catch(err => next(err));
});

router.put('/:id', (req, res, next) => {
  const { id } = req.params;
  const updateObj = {
    'name': req.body.name
  };

  knex('folders')
    .returning(['id', 'name'])
    .where({'id': `${id}`})
    .update(updateObj)
    .then(response => {
      res.json(response);
  }).catch(err => {
      next(err);
  })  
});

router.post('/', (req, res, next) => {
    const { name } = req.body;
    
    const newObj = {
     "name": name
    }
    knex
      .insert(newObj)
      .into('folders')
      .returning(['id', 'name'])
      .then(response => {
          console.log(response);
          res.json(response);
        })
      .catch(err =>  {
          res.json(err)
      })
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;
    knex('folders')
    .where({id: `${id}`})
    .returning(['name', 'id'])
    .del()
    .then(response => {
      res.json(response);
    }).catch(err => {
      next(err);
    });
});

module.exports = router;