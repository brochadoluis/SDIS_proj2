mongoose = require('mongoose');

var fileSchema = mongoose.Schema({
    name: String
});

var File = mongoose.model('File', fileSchema);

File.getFiles = function (callback) {
    File.find(callback);
};

File.getFileByName = function (name, callback) {
    File.find({name: name}, callback);
};


File.addFile = function(name, callback) {
    var newFile = new File ({
        name: name
    });
    newFile.save(function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

File.deleteFile = function(name, callback) {
    File.remove({name: name},callback);
}
exports.fileModel = File;