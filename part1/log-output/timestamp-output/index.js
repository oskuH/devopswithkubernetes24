const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const directory = path.join('/', 'usr', 'src', 'app', 'files');

const uuid = uuidv4();

const getTimestamp = async () => new Promise((res, rej) => {
    const filePath = path.join(directory, 'timestamps/timestamp.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read timestamp', err);
            return rej(err);
        }
        res(data);
    });
});

const getPingPongs = async () => new Promise((res, rej) => {
    const filePath = path.join(directory, 'pingpongs/pingpong.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read pingpongs'. err);
            return rej(err);
        }
        res(data);
    });
});

app.get('/', async (req, res) => {
    const timestamp = await getTimestamp();
    const pingpongs = await getPingPongs();
    const op = `${timestamp.trim()}: ${uuid}.\nPing / Pongs: ${pingpongs.trim()}`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(op);
});

app.listen(PORT);