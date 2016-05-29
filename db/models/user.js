mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String
});

var User = mongoose.model('User', userSchema);

User.getUserByName = function (name, callback) {
    User.find({name: name}, callback);
};

User.getUserByEmail = function (email, callback) {
    User.find({email: email}, callback);
};

User.getUsers = function(callback) {
	User.find(callback);
};

User.registerUser = function (name, username, email, password, callback) {
    var user = new User({name: name, username: username, email: email, password: password});

    user.save(callback);
};

User.deleteUser = function(name, callback) {
	User.remove({name: name}, callback);
}

exports.userModel = User;