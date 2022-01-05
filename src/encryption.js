import fs from 'fs';
import crypto from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const algorithm = 'aes-256-ctr';

class Encryption {

    /**
     * @name encrypt
     * @description Encrypts the database file
     * @param {String} password 
     */
    static async encrypt(password) {
        // Getting dirs
        const __dirname = dirname(fileURLToPath(import.meta.url).replace('src/', ''));
        const encryptedFilePath = join(__dirname, 'db.json.enc');
        const unencryptedFilePath = join(__dirname, 'db.json');

        // We check if the database file is decrypted
        if (!fs.existsSync(encryptedFilePath)) {
            if (fs.existsSync(unencryptedFilePath)) {
                // Encrypting the file
                const fileContent = fs.readFileSync(unencryptedFilePath);
                const buffer = Buffer.from(fileContent);

                const key = crypto.createHash('sha256').update(String(password)).digest('base64').substring(0, 32);
                const iv = crypto.randomBytes(16);
                const cipher = crypto.createCipheriv(algorithm, key, iv);

                const result = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);

                // Write encrypted content to file
                fs.writeFileSync(unencryptedFilePath, result);

                // Renaming the file
                fs.renameSync(unencryptedFilePath, encryptedFilePath);
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
        // Getting dirs
        const __dirname = dirname(fileURLToPath(import.meta.url).replace('src/', ''));
        const encryptedFilePath = join(__dirname, 'db.json.enc');
        const unencryptedFilePath = join(__dirname, 'db.json');

        // We check if the database file is not encrypted
        if (!fs.existsSync(unencryptedFilePath)) {
            if (fs.existsSync(encryptedFilePath)) {
                try {
                    // Decrypting the file
                    let encrypted = fs.readFileSync(encryptedFilePath);

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
                    fs.writeFileSync(encryptedFilePath, result);
                    fs.renameSync(encryptedFilePath, unencryptedFilePath);
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