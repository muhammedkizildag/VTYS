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
        CREATE TABLE address (
        address_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(100) DEFAULT '',
        customer_id UUID NOT NULL,
        city VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        street VARCHAR(255) NOT NULL,
        neighbourhood VARCHAR(100) NOT NULL,
        "number" VARCHAR(20) NOT NULL,
        CONSTRAINT fk_address_owner
            FOREIGN KEY (customer_id)
            REFERENCES customer(customer_id)
            ON DELETE CASCADE
  ); 
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
        DROP TABLE IF EXISTS address;
    `);
};
