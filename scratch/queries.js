'use strict';

const knex = require('../knex');

// let searchTerm = 'gaga';
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });

//Get Note By Id accepts an ID. It returns the note as an object not an array
// let id = 4;
// knex
//   .select()
//   .from('notes')
//   .where({'id': `${id}`})
//   .then(results => console.log(results[0]));


//Update Note By Id accepts an ID and an object with the desired updates. It returns the updated note as an object
// let objectValues = {
//   content: 'test 4534503495'
// };

// let testID = 4;
// knex('notes')
//   .returning(['title', 'id', 'content'])
//   .where({id: `${testID}`})
//   .update(objectValues)
//   .then(res => console.log(res));

// Create a Note accepts an object with the note properties and inserts it in the DB. It returns the new note (including the new id) as an object.
knex('notes')
  .returning(['id', 'title', 'content', 'created'])
  .insert({title: 'Test 1', content: 'Test 2'})
  .then(response => console.log(response[0]));

// let newObj = {
//   title: 'Test 3',
//   content: 'Test 34002490934'
// };

// knex('notes')
//   .returning(['id', 'title', 'content', 'created'])
//   .insert(newObj)
//   .then(response => console.log(response));


  

// Delete Note By Id accepts an ID and deletes the note from the DB.
let deleteID = 1002;
knex('notes')
  .where({
    id: `${deleteID}`
  })
  .del()
  
  .then(resp => console.log(resp));

// knex('notes')
//   .select('id', 'title', 'content', 'created')
//   .then(resp => console.log(resp));