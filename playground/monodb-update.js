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

    db.collection('Users').findOneAndUpdate({
      name: "Roby Thomas"
    }, {
      $set: {
        name: "Andrew"
      },
      $inc: {
        age: 1
      }
    }, {
      returnOriginal: false
    }).then((result) => {
      console.log(JSON.stringify(result, undefined, 2));
    }, (err) => {
      console.log(`Unable to update Users - ${err}`);
    }).finally(() => {
      client.close();
      console.log()
    });
  }
});
