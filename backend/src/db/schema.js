import { pgTable, serial, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['New', 'Contacted', 'Qualified', 'Lost']);

export const leads = pgTable('leads', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    status: statusEnum('status').notNull().default('New'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});