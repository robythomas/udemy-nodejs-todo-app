const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI,  {useNewUrlParser: true});

var saveModel = (aModel) => {
  aModel.save().then((doc) => {
    console.log("Model has been saved");
    console.log(JSON.stringify(doc, undefined, 2));
  }, (err) => {
    console.log(`Unable to save the model - ${err}`);
  })
};


module.exports = {
  mongoose,
  saveModel
};
