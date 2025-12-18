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
    CREATE TABLE products (
    product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL,
    name VARCHAR(150) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    status VARCHAR(20) CHECK (status IN ('available', 'unavailable')) DEFAULT 'available',
    description TEXT,
    image_url TEXT,
    CONSTRAINT fk_product_restaurant
        FOREIGN KEY(restaurant_id)
        REFERENCES restaurant(restaurant_id)
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
  pgm.sql(`DROP TABLE IF EXISTS products;`);
};
