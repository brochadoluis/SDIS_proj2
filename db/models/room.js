mongoose = require('mongoose');
var randomstring = require("randomstring");
var models = require('../models/index.js');


var roomSchema = mongoose.Schema({
    name: String,
    code: String,
    users:[String],
    files:[String]
});

var Room = mongoose.model('Room', roomSchema);

Room.getRooms = function (callback) {
    Room.find(callback);
};

Room.getRoomByName = function (name, callback) {
    Room.find({name: name}, callback);
};

Room.getRoomByCode = function (code, callback) {
    Room.find({code: code}, callback);
};

Room.getRoomByUser = function (username, callback) {
	Room.find({ users: username }, callback);
};

Room.getUsers = function(roomName,callback) {
    Room.findOne({name: roomName},{users: [String]},callback);
};

Room.createRoom = function(name,callback) {
	var code = randomstring.generate(7);
	var newRoom = new Room({
		name: name,
		code: code
	});
	 newRoom.save(function (err) {
        if (err) {
            callback(err);
        } else {
        	callback(null);
        }
    });
};

Room.addUserToRoom = function( roomName ,username, callback){
	Room.update({name: roomName}, {$push: {'users': username}},callback);
};

Room.addFileToRoom = function(roomName, name, callback){
	Room.update({name: roomName}, {$push: {'files': name}},callback);
};

Room.deleteFileInRoom = function(roomName, name, callback) {
	Room.update({name: roomName}, {$pull: {'files': name}},callback);
};

/*Room.getFilesInRoom = function(username, callback) {
};*/

exports.roomModel = Room;