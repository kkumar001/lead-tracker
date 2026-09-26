import express from 'express';
import cors from 'cors';
import { pool } from './db/db.js';
import leadRoutes from './routes/leadRoutes.js';

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/leads', leadRoutes);

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

export default app;