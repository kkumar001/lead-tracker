import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Lead Tracker API is running');
});

app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        return res.status(200).json({ status: 'ok' });
    } catch (error) {
        return res.status(503).json({ status: 'error', error: 'Database unavailable' });
    }
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});