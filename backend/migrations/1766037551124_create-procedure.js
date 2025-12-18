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
            CREATE OR REPLACE FUNCTION sp_complete_checkout(p_customer_id UUID)
            RETURNS UUID -- Oluşan Siparişin ID'sini döner
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_selected_address_id UUID;
                v_cart_id UUID;
                v_restaurant_id UUID;
                v_total_price DECIMAL(10, 2);
                v_new_order_id UUID;
            BEGIN
                -- 1. Müşterinin seçili adresini bul
                SELECT selected_address_id INTO v_selected_address_id
                FROM customer
                WHERE customer_id = p_customer_id;

                IF v_selected_address_id IS NULL THEN
                    RAISE EXCEPTION 'Müşterinin seçili bir adresi yok.';
                END IF;

                -- 2. Bu adrese bağlı sepeti ve restoranı bul
                SELECT cart_id, restaurant_id INTO v_cart_id, v_restaurant_id
                FROM cart
                WHERE address_id = v_selected_address_id;

                IF v_cart_id IS NULL THEN
                    RAISE EXCEPTION 'Bu adreste aktif bir sepet bulunamadı.';
                END IF;

                -- 3. Sepet tutarını hesapla (Sepet boşsa hata ver)
                SELECT SUM(quantity * price) INTO v_total_price
                FROM cart_items
                WHERE cart_id = v_cart_id;

                IF v_total_price IS NULL OR v_total_price = 0 THEN
                    RAISE EXCEPTION 'Sepet boş, sipariş oluşturulamaz.';
                END IF;

                -- 4. ORDERS tablosuna ana kaydı at
                INSERT INTO orders (customer_id, restaurant_id, address_id, total_price, status)
                VALUES (p_customer_id, v_restaurant_id, v_selected_address_id, v_total_price, 'pending')
                RETURNING order_id INTO v_new_order_id;

                -- 5. ORDER_DETAILS tablosuna sepet kalemlerini aktar
                -- Not: Senin order_details tablonun create dosyasında 'options' kolonu yoktu.
                -- Eğer options'ı da saklamak istersen önce order_details tablosuna o kolonu eklemelisin.
                INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_order)
                SELECT v_new_order_id, product_id, quantity, price
                FROM cart_items
                WHERE cart_id = v_cart_id;

                -- 6. Sepeti temizle (Cart silinmez, içindeki ürünler silinir)
                DELETE FROM cart_items
                WHERE cart_id = v_cart_id;

                -- 7. Yeni oluşan sipariş ID'sini döndür
                RETURN v_new_order_id;
            END;
            $$;
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`DROP FUNCTION IF EXISTS sp_complete_checkout(UUID);`);
};