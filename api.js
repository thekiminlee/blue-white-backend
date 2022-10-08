import express from 'express';
import db from './db.js';
import { authenticateCredential, createToken, encrypt, generateSalt } from './util.js';

const apiRouter = express.Router();
const route = '/api/'
const authRoute = '/auth/'

// Authentication
apiRouter.post(authRoute + 'login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = db.data.users.find(_user => _user.email == email);

    var error = function(status, message) {
        return res.status(status).send({
            'authenticationSuccess': false,
            'message': message
        });
    };

    if ([null, undefined].includes(user)) {
        error(404, "Failed to find user");
    } else {
        if (authenticateCredential(password, user.password, user.salt)) {
            res.status(200).send({
                token: createToken(),
                tokenExpiration: Date.now() + (30*60000) // 30 minutes from now
            });
        } else {
            error(403, "Incorrect username or password");
        }
    }
});

apiRouter.post(authRoute + 'register', (req, res) => {
    const newUser = req.body;

    // hash password
    let salt = generateSalt(10);
    let hashedPassword = encrypt(req.body.password, salt);

    newUser.salt = salt;
    newUser.password = hashedPassword;
    
    db.data.users.push(newUser);
    db.write();
    res.status(200).send({
        'user': newUser
    });
});

// Dashboard
apiRouter.get(route + 'users', (req, res) => {
    const users = db.data.users;
    res.status(200).send({
        'users': users
    });
})

apiRouter.get(route + 'users/:id', (req, res) => {
    const user = db.data.users.find(_user => _user._id == req.params.id);
    if ([null, undefined].includes(user)) {
        return res.status(404).send({
            'userExist': false,
            'message': 'User does not exist'
        })
    }
    return res.status(200).send({
        'userExist': true,
        'user': user
    });
});

apiRouter.put(route + 'users/:id', (req, res) => {
    const body = req.body;
    try {
        const userIndex = db.data.users.findIndex(_user => _user._id == req.params.id);
        db.data.users[userIndex] = body
        db.write()
        res.status(200).send({
            'message': 'User updated'
        });
    } catch (e) {
        res.status(400).send({
            'message': e.toString()
        })
    }
});

apiRouter.delete(route + 'users/:id', (req, res) => {
    try {
        const userIndex = db.data.users.findIndex(_user => _user._id == req.params.id);
        if (userIndex > -1) {
            db.data.users.splice(userIndex, 1);
        }
        db.write()
        res.status(200).send({
            'message': "User deleted"
        })
    } catch (e) {
        res.status(400).send({
            'message': e.toString()
        })
    }
})

export default apiRouter;