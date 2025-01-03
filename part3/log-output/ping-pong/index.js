const express = require('express');
const path = require('path');
const app = express();
const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD

if (!POSTGRES_PASSWORD) throw new Error('No value for POSTGRES_PASSWORD environment variable')

const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    password: POSTGRES_PASSWORD,
    host: 'postgres-svc.exercises.svc.cluster.local',
    port: 5432,
    database: 'postgres'
})

client
    .connect()
    .then(async () => {
        console.log('Connected to PostgreSQL database');

        await client.query(
            `CREATE TABLE IF NOT EXISTS counter (
                id SERIAL PRIMARY KEY,
                count INTEGER NOT NULL
            )`);
        
        const res = await client.query('SELECT COUNT(*) FROM counter');
        if (parseInt(res.rows[0].count, 10) === 0) {
            await client.query('INSERT INTO counter (count) VALUES (0)');
        }
    })
    .catch((err) => {
        console.error('Error connecting to PostgreSQL database', err);
    });

const appName = path.basename(path.dirname(__filename));

const getCounter = async () => {
    const res = await client.query('SELECT count FROM counter WHERE id = 1');
    return res.rows[0].count;
};

const incrementCounter = async () => {
    await client.query('BEGIN');
    const res = await client.query('SELECT count FROM counter WHERE id = 1 FOR UPDATE');
    const newCount = res.rows[0].count + 1;
    await client.query('UPDATE counter SET count = $1 WHERE id = 1', [newCount]);
    await client.query('COMMIT');
    return newCount;
}

app.get('/', async (req, res) => {
    try {
        const pong = await getCounter()
        res.status(200).send(pong.toString());
    } catch (err) {
        console.error('Error fetching counter', err);
        res.status(500).send('Error fetching counter.')
    }
});

app.get('/pingpong', async (req, res) => {
    try {
        const pong = await incrementCounter()
        res.status(200).send(`pong ${pong}`);
    } catch (err) {
        console.error('Error incrementing counter', err);
        res.status(500).send('Error incrementing counter.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`${appName} started in port ${PORT}`)
});