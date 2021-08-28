const crypto = require("crypto");
const { CIPHER_IV, CIPHER_KEY } = require('../config')
const key = CIPHER_KEY;
const iv = CIPHER_IV;

module.exports = {
    /**
     * 
     * @param {*} text 
     * @returns 
     */
    encryptText(text) {
        if (!text) {
            return null
        } else {
            let cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
            let encrypted = cipher.update(text);
            encrypted = Buffer.concat([encrypted, cipher.final()]);

            return encrypted.toString('hex');
        }
    },

    /**
     * 
     * @param {*} text 
     */
    decryptText(text) {
        if (!text) {
            return null
        } else {
            let encryptedText = Buffer.from(text, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
            let decrypted = decipher.update(encryptedText);

            return decrypted.toString();
        }
    }
}