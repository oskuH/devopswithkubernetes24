const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(express.static('dist'));
app.use(requestLogger);
app.use(cors());

let directory;

if (process.env.NODE_ENV === 'production') {
  directory = path.join('/', 'usr', 'src', 'app', 'image');
} else if (process.env.NODE_ENV === 'test') {
  directory = path.join(__dirname, 'testimage');
}

const filePath = path.join(directory, 'image.jpg');

const getImage = async () => new Promise(res => {
  fs.readFile(filePath, (err, buffer) => {
    if (err) return console.log('FAILED TO READ FILE', '----------------', err);
    res(buffer);
  });
});

app.get('/api', async (req, res) => {
  if (req.path.includes('favicon.ico')) return;

  try {
    const image = await getImage();
    res.setHeader('Content-type', 'image/jpeg');
    res.status(200).send(image);
  } catch (error) {
    console.log(error);
    res.status(503).send('Image not available yet. Please try again later.');
  }

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});