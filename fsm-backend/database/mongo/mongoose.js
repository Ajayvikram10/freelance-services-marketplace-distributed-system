// Mongoose Setup - MongoDB - ORM
const mongoose      = require("mongoose");
const options       = {
    // autoIndex: false, // Don't build indexes
};
mongoose.Promise    = global.Promise;
// mongoose.connect('mongodb://localhost:27017/freelancerdb', options);
mongoose.connect('mongodb://suhas:suhas@ds119772.mlab.com:19772/freelancerdb', options);

module.exports = mongoose;