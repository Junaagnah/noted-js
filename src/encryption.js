import fs from 'fs';
import crypto from 'crypto';

const algorithm = 'aes-256-ctr';

class Encryption {

    /**
     * @name encrypt
     * @description Encrypts the database file
     * @param {String} password 
     */
    static async encrypt(password) {
        // We check if the database file is decrypted
        if (!fs.existsSync('db.json.enc')) {
            if (fs.existsSync('db.json')) {
                // Encrypting the file
                const fileContent = fs.readFileSync('db.json');
                const buffer = Buffer.from(fileContent);

                const key = crypto.createHash('sha256').update(String(password)).digest('base64').substring(0, 32);
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv(algorithm, key, iv);

                const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

                // Write encrypted content to file
                fs.writeFileSync('db.json', result);

                // Renaming the file
                fs.renameSync('db.json', 'db.json.enc');
            } else {
                throw new Error('Database not found !');
            }
        } else {
            throw new Error('Database is already encrypted !');
        }
    }

    /**
     * @name decrypt
     * @description Decrypts the database file
     * @param {String} password 
     */
    static async decrypt(password) {
        // We check if the database file is not encrypted
        if (!fs.existsSync('db.json')) {
            if (fs.existsSync('db.json.enc')) {
                try {
                    // Decrypting the file
                    let encrypted = fs.readFileSync('db.json.enc');

                    const key = crypto.createHash('sha256').update(String(password)).digest('base64').substring(0, 32);
                    const iv = encrypted.slice(0, 16);
                    encrypted = encrypted.slice(16);

                    const decipher = crypto.createDecipheriv(algorithm, key, iv);

                    const result = Buffer.concat([decipher.update(encrypted), decipher.final()]);

                    // Check if the file is successfully decrypted
                    try {
                        JSON.parse(result);
                    } catch (error) {
                        throw new Error('Incorrect password !');
                    }

                    // Write decrypted content to file and rename it
                    fs.writeFileSync('db.json.enc', result);
                    fs.renameSync('db.json.enc', 'db.json');
                } catch (error) {
                    throw error;
                }
            } else {
                throw new Error('Encrypted database not found !');
            }
        } else {
            throw new Error('Database is already decrypted !');
        }
    }
}

export default Encryption;