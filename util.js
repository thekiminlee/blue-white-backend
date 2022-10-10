import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import db from './db.js';

export function createToken() {
    return Math.random().toString(36).slice(2);
}

export function authenticateCredential(password, userPassword, salt) {
    const hashedPassword = encrypt(password, salt);
    return hashedPassword == userPassword;
}

export function encrypt(hashingValue, salt) {
    let hash = crypto.createHmac('sha1', salt)
    hash.update(hashingValue);
    let hashedValue = hash.digest('hex');
    return hashedValue;
}

export function generateSalt(rounds) {
    return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
}

export function generateUuid() {
    const userId = uuidv4();
    const user = db.data.users.find(_user => _user._id == userId)
    while(user != undefined) {
        userId = uuidv4();
    }
    return userId;
}

export function generateGuid() {
    const guid = uuidv4();
    const user = db.data.users.find(_user => _user.guid == guid)
    while(user != undefined) {
        guid = uuidv4();
    }
    return guid;
}

export function isExistingUser(email) {
    const user = db.data.users.find(_user => _user.email == email);
    return ![null, undefined].includes(user);
}

