var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var passportlocalMongoose = require('passport-local-mongoose');
mongoose.connect("mongodb://0.0.0.0:27017/test33").then(function() {
    console.log("You're Connected");
});

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationTokenExpiresAt: Date
});

mongoose.plugin(passportlocalMongoose);

module.exports = mongoose.model("user", userSchema);