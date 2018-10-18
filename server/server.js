const {mongoose, saveModel} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var newTodo = new Todo({
  text: 'Cook Dinner'
});

saveModel(newTodo);

var completedTodo = new Todo({
  text: 'Eat breakfast',
  completed: true,
  completedAt: new Date().getTime()
});

saveModel(completedTodo);

var newUser = new User({
  email: 'me@somewhere.com'
});

saveModel(newUser);
