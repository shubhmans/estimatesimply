import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  credits: integer('credits').default(10).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  inputText: text('input_text').notNull(),
  industry: text('industry'),
  budget: text('budget'),
  timeline: text('timeline'),
  estimateUnit: text('estimate_unit').default('days').notNull(), // 'days' | 'hours'
  generatedScope: text('generated_scope').notNull(), // JSON string representing the full scope hierarchy
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
