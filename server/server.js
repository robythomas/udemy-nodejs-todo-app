const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose, saveModel} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(500).send(`Could not fetch todos - ${err}`);
  });
});

app.get('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params['id'])) {
    res.status(400).send(`Your request has provided an invalid data`);
  }
  else {
    Todo.findById(req.params['id']).then((todo) => {
      if(!todo) {
        res.status(404).send(`Could not find todo with id ${req.params['id']}`);
      }
      else {
        res.send({todo});
      }
    }, (err) => {
        res.status(500).send(`Could not fetch todos`);
      }
    );
  }
});

app.post('/todos', (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });
  newTodo.save().then((doc) => {
    res.status(201).send(doc);
  }, (err) => {
    res.status(400).send(`Failed to save the todo item - ${err}`);
  });
});

app.listen(3000, () => {
  console.log("TodoApp has started");
});

module.exports = {
  app
};
