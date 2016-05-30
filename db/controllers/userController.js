var models = require('../models/index.js');
// Load the bcrypt module
var bcrypt = require('bcryptjs');
// Generate a salt
var salt = bcrypt.genSaltSync(10);
// Hash the password with the salt

//bcrypt.compareSync("my password", hash)

exports.login = function (email, password, session, res) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
         models.userModel.getUserByEmail(email, function (err, user) {
            if (err) {
                return res.status(400).json({error: "Invalid Login"});
            }
            if (user.length == 0) {
                return res.status(400).json({error: "Cannot find user"});
            }
            bcrypt.compare(password, hash, function(err, pokemon) {
                if(pokemon === true){
                    session.email = user[0].email;
                    session.password = user[0].password;
                    session.name = user[0].name;
                    session.username = user[0].username;
                    models.roomModel.getRoomByUser(session.username, function( erro, room){
                        if(room.length == 0){
                            res.redirect('/rooms');
                        }
                        else{
                            res.redirect('/home');
                        }
                    });                
                }
                else {
                    res.redirect('/');
                }
            });
        });
     });
    });
};

exports.register = function (name, username, email, password, session, res) {
    models.userModel.getUserByEmail(email, function (err, user) {
        if (err) {
            return res.status(400).json({error: "Error in database"});
        }

        if (user.length == 0) {
            bcrypt.hash(password, salt, function(err, hash) {
            models.userModel.registerUser(name, username, email, hash, function (err, user) {
                if (err) {
                    return res.status(400).json({error: "Error in database"});
                }

                if (user.length == 0) {
                    return res.status(400).json({error: "Error registering user"});
                }

                if (user.email === email) {
                    session.name = user.name;
                    session.username = user.username;
                    session.email = email;
                    session.password = hash;
                    res.redirect('/rooms');

                } else {
                    return res.status(400).json({error: "Invalid Fields"});
                }
            });
        });
     } else {
        return res.status(400).json({error: "User already registered"});
    }

});
};