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

    db.collection('Users').deleteMany({name: "Jen Roby"}).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log("Unable to delete Users")
    });

    // db.collection('Todos').deleteOne({text: "Eat Lunch"}).then((result) => {
    //   console.log(JSON.stringify(result, undefined, 2));
    // }, (err) => {
    //   console.log("Unable to delete Todos")
    // }).finally(() => {
    //   console.log("Successfully disconnected from Mongo database server.");
    //   client.close();
    // });

    db.collection('Users').findOneAndDelete({
      _id: new ObjectID("5b74312f6191da39d9e24828")
    }).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log("Unable to delete Todos")
    });
  }
});
