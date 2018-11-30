const express = require('express');
const bodyParser = require('body-parser');

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
