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
        CREATE OR REPLACE FUNCTION create_customer_restaurant_owner()
        RETURNS TRIGGER AS $$
        BEGIN
            
            
            INSERT INTO customer (customer_id)
            VALUES (NEW.user_id);

            INSERT INTO restaurant_owner (owner_id)
            VALUES (NEW.user_id);
            

            -- Trigger AFTER olduğu için return değeri işlemi etkilemez ama
            -- standart olarak NEW döndürülür.
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;  


        CREATE TRIGGER trg_fiyat_takip
        AFTER INSERT ON users
        FOR EACH ROW
        EXECUTE FUNCTION create_customer_restaurant_owner();
        
        `);

};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {};
