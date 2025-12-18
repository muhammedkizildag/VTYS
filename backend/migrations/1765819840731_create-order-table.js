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
        CREATE TABLE orders (
        order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        customer_id UUID,
        restaurant_id UUID,
        address_id UUID, 
        status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')) DEFAULT 'pending',
        total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_order_customer
            FOREIGN KEY(customer_id)
            REFERENCES customer(customer_id)
            ON DELETE SET NULL,
        CONSTRAINT fk_order_restaurant
            FOREIGN KEY(restaurant_id)
            REFERENCES restaurant(restaurant_id)
            ON DELETE SET NULL,
        CONSTRAINT fk_order_address
            FOREIGN KEY(address_id)
            REFERENCES address(address_id)
            ON DELETE SET NULL
    );
        CREATE TABLE order_details (
        order_detail_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        order_id UUID NOT NULL,
        product_id UUID,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        unit_price_at_order DECIMAL(10, 2) NOT NULL,
        CONSTRAINT fk_detail_order
            FOREIGN KEY(order_id)
            REFERENCES orders(order_id)
            ON DELETE CASCADE,
        CONSTRAINT fk_detail_product
            FOREIGN KEY(product_id)
            REFERENCES products(product_id)
            ON DELETE SET NULL
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
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS order_details;
        `);

};
