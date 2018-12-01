const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose, saveModel} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 3000;

var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var newTodo = new Todo({
    text: req.body.text
  });
  newTodo.save().then((todo) => {
    res.status(201).send({todo});
  }, (err) => {
    res.status(400).send(`Failed to save the todo item - ${err}`);
  });
});

app.get('/todos', (req, res) => {
  Todo.find({}).then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(500).send(`Could not fetch todos - ${err}`);
  });
});

app.get('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)) {
    res.status(400).send(`Your request has provided an invalid data`);
  }
  else {
    Todo.findById(req.params.id).then((todo) => {
      if(!todo) {
        res.status(404).send(`Could not find todo with id ${req.params.id}`);
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

app.patch('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Your request has provided invalid data");
  }
  else {
    var body = req.body;
    Todo.findById(req.params.id).then((todo) => {
      if(!todo) {
        return res.status(404).send(`Failed to find a todo by id ${req.params.id} to update`);
      }

      if(_.isBoolean(body.completed)) {
        if(body.completed && !todo.completed) {
          body.completedAt = new Date().getTime();
        }
        else if(!body.completed && todo.completed) {
          body.completedAt = null;
        }
      }

      Todo.findByIdAndUpdate(req.params.id, {$set: body}, {new: true}).then((todo) => {
        if(!todo) {
          res.status(404).send(`Failed to find a todo by id ${req.params.id} to update`);
        }
        else {
          res.status(200).send({todo});
        }
      }, (err) => {
        console.log(err);
        res.status(500).send("Failed to update the todo item");
      });
    }, (err) => {

    });
  }
});

app.delete('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)) {
    res.status(400).send("Your request has provided invalid data");
  }
  else {
    Todo.findByIdAndDelete(req.params.id).then((todo) => {
      if(!todo) {
        res.status(404).send(`Could not find a todo with id ${req.params.id} to delete`);
      }
      else {
        res.send({todo});
      }
    }, (err) => {
      res.status(500).send("Unable to delete todo");
    });
  }
});

app.listen(port, () => {
  console.log(`TodoApp has started on ${port}`);
});

module.exports = {
  app
};
