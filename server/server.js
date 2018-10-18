const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var saveTodo = (aTodo) => {
  aTodo.save().then((doc) => {
    console.log("Todo has been saved");
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    console.log(`Unable to save new todo - ${err}`);
  })
};

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var newTodo = new Todo({
  text: 'Cook Dinner',
  completed: false
});

saveTodo(newTodo);

var completedTodo = new Todo({
  text: 'Eat breakfast',
  completed: true,
  completedAt: new Date().getTime()
});

saveTodo(completedTodo);
