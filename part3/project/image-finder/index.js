const fs = require('fs');
const path = require('path');
const axios = require('axios');

const directory = path.join('/', 'usr', 'src', 'app', 'image');
const filePath = path.join(directory, 'image.jpg');

const getNewImage = async () => {
  const response = await axios.get('https://picsum.photos/300', { responseType: 'stream' });
  const tempFilePath = filePath + '.tmp';
  const writer = fs.createWriteStream(tempFilePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => {
      fs.rename(tempFilePath, filePath, (err) => {
        if (err) {
          console.error(`Failed to rename ${tempFilePath} to ${filePath}`, err);
          reject(err);
        } else {
          console.log(`Renamed ${tempFilePath} to ${filePath}`);
          resolve();
        }
      });
    });
    writer.on('error', reject);
  });
};

const start = async() => {
  try {
    await getNewImage();
    setTimeout(start, 3600000);
  } catch (error) {
    console.error('Failed to get new image', error);
    start();
  }
};

start();