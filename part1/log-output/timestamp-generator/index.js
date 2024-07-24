const fs = require('fs')
const path = require('path')

const directory = path.join('/', 'usr', 'src', 'app', 'files')
const filePath = path.join(directory, 'timestamp.txt')

const generateTimestamp = () => {
    const timestamp = new Date().toISOString();
    fs.writeFile(filePath, `${timestamp}\n`, (err) => {
        if (err) {
            console.error('Failed to write timestamp to file', err);
        } else {
            console.log('Timestamp saved:', timestamp);
        }
    })
    setTimeout(generateTimestamp, 5000);
}

generateTimestamp();