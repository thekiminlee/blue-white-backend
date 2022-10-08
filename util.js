import crypto from 'crypto';

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
    return hashedValue
}

export function generateSalt(rounds) {
    return crypto.randomBytes(Math.ceil(rounds / 2)).toString('hex').slice(0, rounds);
}


