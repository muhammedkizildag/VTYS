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
        CREATE TABLE restaurant(
        restaurant_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        owner_id UUID NOT NULL,
        name VARCHAR(150) NOT NULL,
        description TEXT,

        -- EKLENMESİ GEREKEN ALANLAR:
        city VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL, -- "Aynı ilçe" kontrolü için bu şart
        full_address TEXT,

        min_order_price DECIMAL(10, 2) DEFAULT 0.00 CHECK (min_order_price >= 0),
        rating DECIMAL(2, 1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_restaurant_owner
            FOREIGN KEY(owner_id)
            REFERENCES users(user_id)
            ON DELETE CASCADE 
        )
        `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS restaurant;
        `)
};
