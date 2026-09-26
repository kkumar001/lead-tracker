import request from 'supertest';
import app from '../app.js';
import { db, pool } from '../db/db.js';
import { leads } from '../db/schema.js';

beforeEach(async () => {
    await db.delete(leads);
}, 30000);

afterAll(async () => {
    await db.delete(leads);
    await pool.end();
});

describe('POST /leads', () => {
    it('creates a lead with valid data', async () => {
        const res = await request(app)
            .post('/leads')
            .send({ name: 'John Doe', email: 'john@example.com', phone: '9876543210' });

        expect(res.status).toBe(201);
        expect(res.body.data.name).toBe('John Doe');
        expect(res.body.data.status).toBe('New');
    });

    it('rejects invalid email', async () => {
        const res = await request(app)
            .post('/leads')
            .send({ name: 'Bad Email', email: 'not-an-email', phone: '123456789' });

        expect(res.status).toBe(400);
    });
});

describe('GET /leads', () => {
    it('lists leads with pagination', async () => {
        await request(app).post('/leads').send({ name: 'Alice', email: 'alice@example.com', phone: '1111111111' });
        await request(app).post('/leads').send({ name: 'Bob', email: 'bob@example.com', phone: '2222222222' });

        const res = await request(app).get('/leads?page=1&pageSize=10');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
        expect(res.body.pagination.totalPages).toBe(1);
    });

    it('searches leads by name', async () => {
        await request(app).post('/leads').send({ name: 'Charlie Search', email: 'charlie@example.com', phone: '3333333333' });
        await request(app).post('/leads').send({ name: 'Unrelated', email: 'unrelated@example.com', phone: '4444444444' });

        const res = await request(app).get('/leads?search=Charlie');

        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].name).toBe('Charlie Search');
    });
});

describe('PATCH /leads/:id/status', () => {
    it('updates status for an existing lead', async () => {
        const createRes = await request(app).post('/leads').send({ name: 'Dana', email: 'dana@example.com', phone: '5555555555' });
        const leadId = createRes.body.data.id;

        const res = await request(app).patch(`/leads/${leadId}/status`).send({ status: 'Contacted' });

        expect(res.status).toBe(200);
        expect(res.body.data.status).toBe('Contacted');
    });

    it('returns 404 for a non-existent lead', async () => {
        const res = await request(app).patch('/leads/999999/status').send({ status: 'Contacted' });
        expect(res.status).toBe(404);
    });

    it('rejects an invalid status value', async () => {
        const createRes = await request(app).post('/leads').send({ name: 'Eve', email: 'eve@example.com', phone: '6666666666' });
        const leadId = createRes.body.data.id;

        const res = await request(app).patch(`/leads/${leadId}/status`).send({ status: 'NotARealStatus' });
        expect(res.status).toBe(400);
    });
});