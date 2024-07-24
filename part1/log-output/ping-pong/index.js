const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'pingpong.txt')

var pong = 0;

const savePong = () => {
    const pongs = pong.toString();
    fs.writeFile(filePath, `${pongs}\n`, (err) => {
        if (err) {
            console.error('Failed to write pongs to file', err);
        } else {
            console.log('pongs saved:', pongs);
        }
    })
}

app.get('/pingpong', (req, res) => {
    res.send(`pong ${pong}`);
    savePong();
    pong += 1;
})

app.listen(PORT);