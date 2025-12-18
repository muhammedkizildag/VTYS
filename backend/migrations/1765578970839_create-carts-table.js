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
  // 1. Ana Sepet Tablosu (Sepetin kime ait olduğu)
  pgm.sql(`
    CREATE TABLE cart (
      cart_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      address_id UUID NOT NULL,
      restaurant_id UUID NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      
      -- Bir müşteri aynı anda sadece bir restoranın sepetine sahip olabilir mantığı için
      -- Yazılım tarafında kontrol edilecek ama veritabanı seviyesinde bu ilişki şart.

        
      CONSTRAINT fk_cart_restaurant
        FOREIGN KEY (restaurant_id)
        REFERENCES restaurant(restaurant_id)
        ON DELETE CASCADE,

      CONSTRAINT fk_cart_address
        FOREIGN KEY (address_id)
        REFERENCES address(address_id)
        ON DELETE CASCADE  
    );
  `);

  // 2. Sepet Ürünleri Tablosu (Sepetin içindeki kalemler)
  pgm.sql(`
    CREATE TABLE cart_items (
      cart_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      cart_id UUID NOT NULL,
      product_id UUID NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      
      -- Seçenekler (Örn: ["Acısız", "Ekstra Peynir"]) için JSONB veri tipi idealdir.
      options JSONB, 
      
      -- Ürünün sepete eklendiği andaki fiyatı (Fiyat değişirse sepet etkilenmesin diye)
      price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
      
      CONSTRAINT fk_cart_item_cart
        FOREIGN KEY (cart_id)
        REFERENCES cart(cart_id)
        ON DELETE CASCADE,
        
      CONSTRAINT fk_cart_item_product
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
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
  // Önce bağımlı olan items tablosunu silmeliyiz
  pgm.sql(`DROP TABLE IF EXISTS cart_items;`);
  pgm.sql(`DROP TABLE IF EXISTS cart;`);
};