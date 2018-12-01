const {MongoClient, ObjectID} = require('mongodb');

const mongoClient = new MongoClient(
  'mongodb://localhost:27017/TodoApp',
  {useNewUrlParser: true});

mongoClient.connect((err, client) => {
  if(err) {
    console.log("Unable to connect to Mongo database server.", err);
  }
  else {
    console.log("Successfully connected to Mongo database server.");
    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //   _id: new ObjectID("5b74351007d9ef3b15394f22")
    // }).toArray().then((docs) => {
    //   console.log("Todos");
    //   console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //   console.log("Unable to fetch todos")
    // }).finally(() => {
    //   console.log("Successfully disconnected from Mongo database server.");
    //   client.close();
    // });

    db.collection('Users').find({name: "Andrew Thomas"}).toArray().then((users) => {
      console.log(`Users`);
      console.log(JSON.stringify(users, undefined, 2));
    }, (err) => {
      console.log("Unable to get Users")
    }).finally(() => {
      console.log("Successfully disconnected from Mongo database server.");
      client.close();
    });
  }
});
