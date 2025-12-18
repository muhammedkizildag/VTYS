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
    CREATE TABLE restaurant_owner (
      owner_id UUID PRIMARY KEY,
      phone_number VARCHAR(50),
      tax_id_number VARCHAR(20), -- Vergi No veya TCKN
      iban VARCHAR(50),          -- Ödemeleri almak için
      
      CONSTRAINT fk_owner_user
        FOREIGN KEY (owner_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
    );
  `)


};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { };
