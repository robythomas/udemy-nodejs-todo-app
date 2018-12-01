const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var todoId = "5c01efc86eded4232b497465";
var userId = "5c01fa7ca1f26fe0949639a1";

if(!ObjectID.isValid(todoId)) {
  console.log(`Todo ID ${todoId} is not a valid ObjectID`);
};

if(!ObjectID.isValid(userId)) {
  console.log(`User ID ${userId} is not a valid ObjectID`);
};

Todo.find({
  _id: todoId
}).then((todos) => {
  console.log('Todos: ', todos);
}).catch((err) => {
  console.log(err.message);
});

Todo.findOne({
  _id: todoId
}).then((todo) => {
  if(!todo) {
    console.log("Todo not found");
  }
  else {
    console.log("Todo: ", todo);
  }
}).catch((err) => {
  console.log(err.message);
});

Todo.findById(todoId).then((todo) => {
  if(!todo) {
    console.log("Todo not found");
  }
  else {
    console.log("TodoById: ", todo);
  }
}).catch((err) => {
  console.log(err.message);
});

User.findById(userId).then((user) => {
  if(!user) {
    console.log(`Cannot find a user by Id ${userId}`);
  }
  else {
    console.log("User: ", JSON.stringify(user, undefined, 2));
  }
}, (err) => {
  console.log(err.message);
});
