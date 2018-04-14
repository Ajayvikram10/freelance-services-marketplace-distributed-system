const  mongoose = require('../mongoose');
const   bcrypt  = require('bcryptjs');
const   Schema  = mongoose.Schema;

var UserSchema = new Schema({
    username    : { type: String, trim: true, required: true, index: { unique: true } },
    email       : { type: String, trim: true, required: true, index: { unique: true } },
    password    : { type: String, required: true },
    name        : { type: String, trim: true, default: '' },
    summary     : { type: String, trim: true, default: '' },
    phone       : { type: String, trim: true, default: '' },
    about_me    : { type: String, trim: true, default: '' },
    skills      : [ { type: String } ],
    looking_for : { type: String, trim: true, default: '' }
});

// Mongoose middleware -> Let's you run certain code before or after certain events. (eg. before 'save')
UserSchema.pre('save', function (next) {
    // Arrow function don't bind a 'this' keyword.
    // Normal function binds 'this' keyword.
    // 'this' keyword stores individual document.
    let user = this; // We are manipulating user using 'this'. This is the document, where the method was called on.

    // 'save' can be invoked again in future for some event (say user's email update)
    // to avoid hashing the hashed password again, we use below method.
    // isModified is instance method. Returns 'true' if modified else 'false'
    // we only encrypt 'password' if only it was just modified.
    if (user.isModified('password')) {

        // generate salt.
        bcrypt.genSalt(10, (err, salt) => {
            // generate hash.
            bcrypt.hash(user.password, salt, (err, hash) => {
                // replace with generated hash.
                user.password = hash;
                next();
            })
        });

    } else {
        next();
    }
});

// .statics -> kind of like .methods (instance method).
// whatever we add onto it turns into a (model method)
UserSchema.statics.findByCredentials = function (loginInfo) {

    let user = this;

    return user.findOne({ username: loginInfo.username })
               .then((user) => {
                   if (!user) {
                       return Promise.reject({ errMsg: "INVALID_user" });
                   }
                   // all bcrypt methods support callback and not promises.
                   return new Promise((resolve, reject) => {
                       bcrypt.compare(loginInfo.password, user.password, (err, res) => {
                           if(res) {
                               resolve(user);
                           } else {
                               reject({ errMsg: "INVALID_login" });
                           }
                       });
                   });
               });
};

let User = mongoose.model('User', UserSchema, 'user');
module.exports =  User;