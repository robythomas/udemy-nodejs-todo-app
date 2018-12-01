const {MongoClient, ObjectID} = require('mongodb');

const mongoClient = new MongoClient(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
  {useNewUrlParser: true});

mongoClient.connect((err, client) => {
  if(err) {
    console.log("Unable to connect to Mongo database server.", err);
  }
  else {
    console.log("Successfully connected to Mongo database server.");
    const db = client.db('TodoApp');

    db.collection('Todos').insertOne({
      text: 'My first todo',
      completed: false
    }, (err, res) => {
        if(err) {
          console.log("Unable to insert the Todo document", err);
        }
        else {
          console.log(JSON.stringify(res.ops, undefined, 2));
        }
      });

    // db.collection('Users').insertOne({
    //   name: 'Roby Thomas',
    //   age: 37,
    //   location: 'Kochi'
    // }, (err, res) => {
    //   if(err) {
    //     return console.log("Unable to insert the User document", err);
    //   }
    //   console.log(res.ops[0]._id.getTimestamp());
    // });

    // client.close();
  }
});
