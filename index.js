#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Commands
yargs(hideBin(process.argv))
    .command('encrypt <password>', 'Encrypts the database with your password', () => { }, (argv) => {
        console.info(argv);
    })
    .command('decrypt <password>', 'Decrypts the database with your password', () => { }, (argv) => {
        console.info(argv);
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
