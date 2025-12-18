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
  
  // 1. AKTİF SEPET GÖRÜNÜMÜ
  // Karmaşık JOIN işlemlerini saklar. 
  // Backend'de sadece "WHERE customer_id = $1" demek yeterli olur.
  pgm.sql(`
    CREATE OR REPLACE VIEW vw_active_cart_details AS
    SELECT 
        cust.customer_id,
        c.cart_id,
        r.restaurant_id,
        r.name AS restaurant_name,
        r.min_order_price,
        p.product_id,
        p.name AS product_name,
        p.image_url AS product_image,
        ci.quantity,
        ci.price AS unit_price,
        (ci.quantity * ci.price) AS total_line_price,
        ci.options,
        a.title AS address_title
    FROM 
        cart_items ci
    INNER JOIN cart c ON ci.cart_id = c.cart_id
    INNER JOIN address a ON c.address_id = a.address_id
    INNER JOIN customer cust ON a.customer_id = cust.customer_id
    INNER JOIN restaurant r ON c.restaurant_id = r.restaurant_id
    INNER JOIN products p ON ci.product_id = p.product_id
    WHERE 
        -- En Kritik Nokta: Sadece müşterinin ŞU AN SEÇİLİ adresindeki sepeti getirir.
        cust.selected_address_id = c.address_id;
  `);

  // 2. SİPARİŞ ÖZETİ GÖRÜNÜMÜ
  // Panelde siparişleri listelerken isimleri görmek için.
  pgm.sql(`
    CREATE OR REPLACE VIEW vw_order_summary AS
    SELECT 
        o.order_id,
        o.created_at,
        o.status,
        o.total_price,
        
        -- Müşteri Bilgileri
        u.user_id AS customer_user_id,
        u.name AS customer_name,
        cust.phone_number AS customer_phone,
        
        -- Restoran Bilgileri
        r.restaurant_id,
        r.name AS restaurant_name,
        
        -- Adres Bilgileri
        a.title AS address_title,
        a.district,
        a.city,
        CONCAT(a.street, ' No:', a.number, ' ', a.neighbourhood) as open_address
    FROM 
        orders o
    INNER JOIN users u ON o.customer_id = u.user_id
    INNER JOIN customer cust ON o.customer_id = cust.customer_id
    INNER JOIN restaurant r ON o.restaurant_id = r.restaurant_id
    LEFT JOIN address a ON o.address_id = a.address_id;
  `);

  // 3. MENÜ GÖRÜNÜMÜ
  // Ürünleri çekerken restoran durumuyla birlikte görmek için.
  pgm.sql(`
    CREATE OR REPLACE VIEW vw_restaurant_menu AS
    SELECT 
        p.product_id,
        p.name,
        p.description,
        p.unit_price,
        p.image_url,
        p.status AS product_status,
        r.restaurant_id,
        r.name AS restaurant_name,
        r.min_order_price,
        r.rating
    FROM 
        products p
    INNER JOIN restaurant r ON p.restaurant_id = r.restaurant_id;
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`DROP VIEW IF EXISTS vw_restaurant_menu;`);
  pgm.sql(`DROP VIEW IF EXISTS vw_order_summary;`);
  pgm.sql(`DROP VIEW IF EXISTS vw_active_cart_details;`);
};