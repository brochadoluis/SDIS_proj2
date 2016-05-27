mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    user:{
    	username: String
    },
    files:{
    	name: String
    }
});

var Room = mongoose.model('Room', roomSchema);

Room.getRooms = function (callback) {
    Room.find(callback);
};

Room.getRoomByID = function (id, callback) {
    Room.find({_id: id}, callback);
};

Room.getFilesByRoom = function(id,callback){
	Room.find({_id: id},callback);
};

exports.roomModel = Room;