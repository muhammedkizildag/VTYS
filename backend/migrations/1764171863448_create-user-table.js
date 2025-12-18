/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
  `);

  pgm.sql(`
    CREATE TYPE role AS ENUM ('CUSTOMER', 'RESTAURANT_OWNER');
  `);

  pgm.sql(`
    CREATE TABLE users (
      user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      password_hash VARCHAR(256) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      role role NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS users;`);
  pgm.sql(`DROP TYPE IF EXISTS role;`);
};
