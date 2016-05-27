mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
});

var User = mongoose.model('User', userSchema);


User.getUserByEmail = function (email, callback) {
    User.find({email: email}, callback);
};

User.registerUser = function (email, password, name, callback) {
    var user = new User({name: name, email: email, password: password});

    user.save(callback);
};

exports.userModel = User;