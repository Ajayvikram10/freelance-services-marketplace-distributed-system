// Mongoose Setup - MongoDB - ORM
const mongoose      = require("mongoose");
const options       = {
    poolSize: 10
};
mongoose.Promise    = global.Promise;
mongoose.connect('mongodb://localhost:27017/freelancerdb', options);

module.exports = mongoose;