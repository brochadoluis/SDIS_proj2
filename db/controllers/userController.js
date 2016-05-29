var models = require('../models/index.js');

exports.login = function (email, password, session, res) {
    models.userModel.getUserByEmail(email, function (err, user) {
        if (err) {
            return res.status(400).json({error: "Invalid Login"});
        }

        if (user.length == 0) {
            return res.status(400).json({error: "Cannot find user"});
        }

        if (user[0].password == password) {
            session.email = user[0].email;
            session.password = password;
            session.name = user[0].name;
            session.username = user[0].username;
            res.redirect('/home');
        } else {
            return res.status(400).json({error: "Invalid password"});
        }
    });
};

exports.register = function (name, username, email, password, session, res) {
    models.userModel.getUserByEmail(email, function (err, user) {
        if (err) {
            return res.status(400).json({error: "Error in database"});
        }

        if (user.length == 0) {
            models.userModel.registerUser(name, username, email, password, function (err, user) {
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
                    session.password = password;
                    res.redirect('/home');

                } else {
                    return res.status(400).json({error: "Invalid Fields"});
                }
            });
        } else {
            return res.status(400).json({error: "User already registered"});
        }
    });
};