#!/usr/bin/env node

// Libs
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Local imports
import Encryption from './src/encryption.js';

// ==== Local database initialization ====
const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, 'db.json');
const encryptedFile = join(__dirname, 'db.json.enc');

// If the encrypted file do not exist, continue
if (!fs.existsSync(encryptedFile)) {
    const adapter = new JSONFile(file);
    const db = new Low(adapter);
    await db.read();

    // If the database do not already exists, create it
    db.data = db.data || { notes: [] };
    await db.write();
}
// ==== Local database initialization ====

// Commands
yargs(hideBin(process.argv))
    .command('encrypt <password>', 'Encrypts the database with your password', () => { }, (argv) => {
        try {
            Encryption.encrypt(argv.password);
        } catch (error) {
            console.error(error.message);
        }
    })
    .command('decrypt <password>', 'Decrypts the database with your password', () => { }, (argv) => {
        try {
            Encryption.decrypt(argv.password)
        } catch (error) {
            console.error(error.message);
        }
    })
    .command('create <name>', 'Creates a new note', () => { }, (argv) => {
        console.info(argv);
    })
    .command('show <name>', 'Shows a note', () => { }, (argv) => {
        console.info(argv);
    })
    .command('edit <name>', 'Edit a note', () => { }, (argv) => {
        console.info(argv);
    })
    .command('delete <name>', 'Deletes a note', () => { }, (argv) => {
        console.info(argv);
    })
    .command('list [page]', 'Lists all notes', () => { }, (argv) => {
        console.info(argv);
    })
    .demandCommand(1)
    .parse();
