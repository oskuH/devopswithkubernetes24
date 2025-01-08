const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
const NAMESPACE = process.env.NAMESPACE;

if (!POSTGRES_PASSWORD) throw new Error('No value for POSTGRES_PASSWORD environment variable');
if (!NAMESPACE) throw new Error('No value for NAMESPACE environment variable');

const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: POSTGRES_PASSWORD,
  host: `postgres-svc.${NAMESPACE}.svc.cluster.local`,
  port: 5432,
  database: 'postgres'
});

client
  .connect()
  .then(async () => {
    console.log('Connected to PostgreSQL database.');

    await client.query(
      `CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        todo TEXT NOT NULL
      )`
    );
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL database', err);
  });

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('Path:  ', request.path);
  console.log('Body:  ', request.body);
  console.log('---');
  next();
};

app.use(requestLogger);
app.use(cors());
app.use(express.json());

const getTodos = async () => {
  const res = await client.query('SELECT todo FROM todos');
  return res.rows.map(row => row.todo);
};

const insertTodo = async (newTodo) => {
  await client.query('INSERT INTO todos (todo) VALUES ($1)', [newTodo]);
};

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/todos', async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos', err);
    res.status(500).json('Error fetching todos.');
  }
});

app.post('/todos', async (req, res) => {
  const newTodo = req.body.todo;
  if (newTodo) {
    try {
      await insertTodo(newTodo);
      res.status(201).json({ message: 'Todo added successfully:', newTodo });
    } catch (err) {
      console.error('Error inserting todo', err);
      res.status(500).json('Error inserting todo.');
    }
  } else {
    res.status(400).json({ message: 'Todo content is required' });
  }
});

const appName = path.basename(path.dirname(__filename));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${appName} started in port ${PORT}`);
});