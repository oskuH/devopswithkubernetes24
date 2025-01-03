const { v4: uuidv4 } = require('uuid');
const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const app = express();

const uuid = uuidv4();
const appName = path.basename(path.dirname(__filename));
let pingpongurl;
let directory;

if (process.env.NODE_ENV == 'production') {
    pingpongurl = 'http://ping-pong-svc:80'
    directory = path.join('/', 'usr', 'src', 'app', 'timestamp');
} else if (process.env.NODE_ENV == 'test') {
    pingpongurl = 'http://localhost:3001'
    directory = path.join(__dirname, 'for_testing');
    // generating a new timestamp every 5 seconds is omitted in testing
    const timestamp = new Date().toISOString();
    fs.writeFile(path.join(directory, 'timestamp.txt'), `${timestamp}\n`, (err) => {
        if (err) {
            console.error('Failed to write timestamp to file', err);
        } else {
            console.log('Timestamp saved:', timestamp);
        }
    })
}

const getFileContent = async () => new Promise((res, rej) => {
    fs.readFile('/config/information.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read file content', err);
            return rej(err)
        }
        res(data);
    })
})

const getTimestamp = async () => new Promise((res, rej) => {
    const filePath = path.join(directory, 'timestamp.txt');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Failed to read timestamp', err);
            return rej(err);
        }
        res(data);
    });
});

const getPingPongs = async () => new Promise((res, rej) => {
    axios.get(pingpongurl)
        .then(response => res(response.data))
        .catch(error => rej(error))
});

app.get('/', async (req, res) => {
    try {
        const file_content = await getFileContent();
        const message = process.env.MESSAGE;
        const timestamp = await getTimestamp();
        const pingpongs = await getPingPongs();
        const op = `file content: ${file_content}\nenv variable: MESSAGE=${message}\n${timestamp.trim()}: ${uuid}.\nPing / Pongs: ${pingpongs}`;
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(op);
    } catch (error) {
        res.status(500).send(`Error occurred: ${error}`)
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`${appName} started in port ${PORT}`)
});