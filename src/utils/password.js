const logger = require('./logger');
const bcrypt = require('bcryptjs');

async function hashPassword(plainTextPassword) {
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        logger.error({ err: error }, "Erro ao realizar o hash da senha.");
    }
}

async function verifyPassword(plainTextPassword, hashedPasswordFromDb) {
    try {
        const isMatch = await bcrypt.compare(plainTextPassword, hashedPasswordFromDb);
        return isMatch;
    } catch (error) {
        logger.error({ err: error }, "Erro ao verificar validade da senha.");
    }
}

module.exports = {
    hashPassword,
    verifyPassword
}