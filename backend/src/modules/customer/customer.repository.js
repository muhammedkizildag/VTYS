import { query } from "../../utils/db.js";

class CustomerRepository {
  async addPhoneNumber({ customerId, phoneNumber }) {
    const result = await query(
      `
      INSERT INTO customer (customer_id, phone_number)
      VALUES ($1, $2)
      RETURNING *`,
      [customerId, phoneNumber]
    );

    return result.rows[0];
  }

  async changePhoneNumber({ customerId, phoneNumber }) {
    const result = await query(
      `
      UPDATE customer
      SET phone_number = $1
      WHERE customer_id = $2
      RETURNING *
      `,
      [phoneNumber, customerId]
    );
    return result.rows[0];
  }

  async addAddress(data) {
    const { customerId, city, district, street, neighbourhood, number, title } = data;
    const result = await query(
      `
      INSERT INTO address (customer_id, city, district, street, neighbourhood, "number", title)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [customerId, city, district, street, neighbourhood, number, title]
    );
    return result.rows[0];
  }

  async updateAddress({ address_id, data }) {
    const fields = [];
    const values = [];

    let i = 1;

    for (const key in data) {
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        fields.push(`"${key}" = $${i}`);
        values.push(data[key]);
        i++;
      }
    }
    values.push(address_id);

    const result = await query(
      `
      UPDATE address
      SET ${fields.join(", ")}
      WHERE address_id = $${i}
      RETURNING *
      `,
      values
    );
    return result.rows[0];
  }

  async getAddresses({ userId }) {
    const result = await query(
      `
      SELECT * 
      FROM address
      WHERE customer_id = $1
      `,
      [userId]
    );
    return result.rows;
  }

  async deleteAddress({ address_id, customer_id }) {
    console.log(address_id, customer_id);

    const result = await query(
      `
      DELETE FROM address
      WHERE address_id = $1 and customer_id = $2
      RETURNING *
      `,
      [address_id, customer_id]
    );
    return result.rows[0];
  }

  async getCart({ userId }) {
    console.log(userId);
    try {
      const result = await query(
        `
          SELECT 
              c.cart_id,
              r.restaurant_id,
              r.name AS restaurant_name,
              r.min_order_price,
              p.product_id,
              p.name AS product_name,
              p.image_url,
              ci.quantity,
              ci.price AS unit_price,
              (ci.quantity * ci.price) AS total_line_price,
              ci.options
          FROM 
              cart_items ci
          -- 1. Ürünün bağlı olduğu sepeti bul
          INNER JOIN 
              cart c ON ci.cart_id = c.cart_id
          -- 2. Sepetin bağlı olduğu adresi bul (KÖPRÜ BURASI)
          INNER JOIN 
              address a ON c.address_id = a.address_id
          -- 3. Adresin bağlı olduğu müşteriyi bul
          INNER JOIN 
              customer cust ON a.customer_id = cust.customer_id
          -- 4. Sepetin ait olduğu restoranı bul
          INNER JOIN 
              restaurant r ON c.restaurant_id = r.restaurant_id
          -- 5. Ürün detaylarını bul
          INNER JOIN 
              products p ON ci.product_id = p.product_id
          WHERE 
              cust.customer_id = $1
              -- ÖNEMLİ: Sadece müşterinin şu an SEÇİLİ olan adresindeki sepeti getir
              AND cust.selected_address_id = c.address_id
        `,
        [userId]
      );

      return result.rows
    }
    catch (e) {
      console.log(e)
      throw e;
    }

  }

  async getOrders({ user_id }) {

    try {
      const result = await query(
        `
        SELECT 
            c.cart_id,
            r.restaurant_id,
            r.name AS restaurant_name,
            r.min_order_price,
            p.product_id,
            p.name AS product_name,
            p.image_url,
            ci.quantity,
            ci.price AS unit_price,
            (ci.quantity * ci.price) AS total_line_price,
            ci.options
        FROM 
            cart_items ci
        -- 1. Ürünün bağlı olduğu sepeti bul
        INNER JOIN 
            cart c ON ci.cart_id = c.cart_id
        -- 2. Sepetin bağlı olduğu adresi bul (KÖPRÜ BURASI)
        INNER JOIN 
            address a ON c.address_id = a.address_id
        -- 3. Adresin bağlı olduğu müşteriyi bul
        INNER JOIN 
            customer cust ON a.customer_id = cust.customer_id
        -- 4. Sepetin ait olduğu restoranı bul
        INNER JOIN 
            restaurant r ON c.restaurant_id = r.restaurant_id
        -- 5. Ürün detaylarını bul
        INNER JOIN 
            products p ON ci.product_id = p.product_id
        WHERE 
            cust.customer_id = $1
            -- ÖNEMLİ: Sadece müşterinin şu an SEÇİLİ olan adresindeki sepeti getir
            AND cust.selected_address_id = c.address_id
      `,
        [user_id]
      );

      return result.rows;
    }

    catch (e) {
      console.log(e)
    }

  }

  async getSelectedAddress(user_id) {
    try {
      const result = await query(`
          SELECT 
              a.address_id,
              a.title,          -- Örn: Ev, İş
              a.city,
              a.district,
              a.neighbourhood,
              a.street,
              a.number
          FROM 
              customer c
          JOIN 
              address a ON c.selected_address_id = a.address_id
          WHERE 
              c.customer_id = $1
        `, [user_id]);

      return result;

    }

    catch (e) {
      console.log(e);
    }


  }

  async getRestaurants(user_id) {
    try {
      const result = await query(
        `
          SELECT 
              r.restaurant_id,
              r.name,
              r.description,
              r.rating,
              r.min_order_price,
              r.city,
              r.district
          FROM 
              restaurant r
          INNER JOIN 
              address a ON r.city = a.city AND r.district = a.district
          INNER JOIN 
              customer c ON c.selected_address_id = a.address_id
          WHERE 
              c.customer_id = $1
        `,
        [user_id]
      );

      return result.rows
    }

    catch (e) {
      console.log(e);
      throw e;
    }

  }

  async getProducts(restaurant_id) {
    try {
      const result = await query(`
          SELECT 
              product_id,
              name,
              description,
              unit_price,
              image_url
          FROM 
              products
          WHERE 
              restaurant_id = $1 
              AND status = 'available'
          ORDER BY 
              name ASC
        `, [restaurant_id]);
      return result.rows;
    }
    catch (e) {
      console.log(e);
      throw e;
    }
  }


  async updateSelectedAddress({ customerId, addressId }) {
    const result = await query(
      `
        UPDATE customer
        SET selected_address_id = $1
        WHERE customer_id = $2
        RETURNING *
    `,
      [addressId, customerId]
    );
    return result.rows[0];
  }

  // src/modules/customer/customer.repository.js içine ekle:

  async addToCart({ userId, restaurantId, productId, quantity = 1, options = null }) {
    try {
      // 1. Önce kullanıcının seçili adresini bul
      const addressResult = await query(
        `SELECT selected_address_id FROM customer WHERE customer_id = $1`,
        [userId]
      );
      const addressId = addressResult.rows[0]?.selected_address_id;

      if (!addressId) throw new Error("Lütfen önce bir teslimat adresi seçin.");

      // 2. Ürünün güncel fiyatını al (Fiyat güvenliği için DB'den çekiyoruz)
      const productResult = await query(
        `SELECT unit_price FROM products WHERE product_id = $1`,
        [productId]
      );
      if (productResult.rows.length === 0) throw new Error("Ürün bulunamadı.");
      const price = productResult.rows[0].unit_price;

      // 3. Bu adrese ait aktif bir sepet var mı kontrol et
      const cartResult = await query(
        `SELECT cart_id, restaurant_id FROM cart WHERE address_id = $1`,
        [addressId]
      );

      let cartId;

      // DURUM A: Sepet zaten var
      if (cartResult.rows.length > 0) {
        const existingCart = cartResult.rows[0];
        cartId = existingCart.cart_id;

        // KONTROL: Sepetteki restoran ile yeni ürünün restoranı aynı mı?
        if (existingCart.restaurant_id !== restaurantId) {
          // FARKLI RESTORAN: Önceki siparişleri (itemları) sil ve sepetin restoranını güncelle
          await query(`DELETE FROM cart_items WHERE cart_id = $1`, [cartId]);

          await query(
            `UPDATE cart SET restaurant_id = $1, updated_at = NOW() WHERE cart_id = $2`,
            [restaurantId, cartId]
          );
        }
      }
      // DURUM B: Sepet yok, yeni oluştur
      else {
        const newCart = await query(
          `INSERT INTO cart (address_id, restaurant_id) VALUES ($1, $2) RETURNING cart_id`,
          [addressId, restaurantId]
        );
        cartId = newCart.rows[0].cart_id;
      }

      // 4. Ürünü sepete ekle (Eğer ürün zaten varsa miktarını artırabiliriz, şimdilik direkt insert/update mantığı)
      // Basitlik için: Aynı ürün varsa miktarını artır, yoksa ekle.
      const existingItem = await query(
        `SELECT cart_item_id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2`,
        [cartId, productId]
      );

      if (existingItem.rows.length > 0) {
        // Miktarı güncelle
        await query(
          `UPDATE cart_items SET quantity = quantity + $1 WHERE cart_item_id = $2`,
          [quantity, existingItem.rows[0].cart_item_id]
        );
      } else {
        // Yeni satır ekle
        await query(
          `INSERT INTO cart_items (cart_id, product_id, quantity, price, options)
           VALUES ($1, $2, $3, $4, $5)`,
          [cartId, productId, quantity, price, options]
        );
      }

      return { success: true, message: "Ürün sepete eklendi" };

    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getRestaurantById(restaurantId) {
    try {
      const result = await query(
        `
        SELECT 
            restaurant_id,
            name,
            description,
            rating,
            min_order_price,
            city,
            district
        FROM 
            restaurant
        WHERE 
            restaurant_id = $1
        `,
        [restaurantId]
      );
      return result.rows[0];
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createOrder(userId) {
    // Transaction Başlat
    await query('BEGIN');

    try {
      // 1. Kullanıcının aktif sepetini bul
      const cartRes = await query(
        `SELECT c.cart_id, c.restaurant_id, c.address_id 
         FROM cart c 
         JOIN customer cust ON c.address_id = cust.selected_address_id
         WHERE cust.customer_id = $1`,
        [userId]
      );
      if (cartRes.rows.length === 0) throw new Error("Aktif sepet veya seçili adres bulunamadı.");
      const cart = cartRes.rows[0];

      // 2. Sepet ürünlerini çek
      // Not: Sepet tablosunda 'cart_items' olduğunu varsayıyoruz.
      const itemsRes = await query(
        `SELECT product_id, quantity, price, options FROM cart_items WHERE cart_id = $1`,
        [cart.cart_id]
      );
      const cartItems = itemsRes.rows;

      if (cartItems.length === 0) throw new Error("Sepetiniz boş.");

      const totalAmount = cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);


      console.log([userId, cart.restaurant_id, cart.address_id, totalAmount])
      // 3. Siparişi Oluştur (Orders Tablosu)
      const orderRes = await query(
        `INSERT INTO orders (customer_id, restaurant_id, address_id, total_price, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING order_id`,
        [userId, cart.restaurant_id, cart.address_id, totalAmount]
      );
      const orderId = orderRes.rows[0].order_id;

      // 4. Sipariş Detaylarını Ekle (Order Details Tablosu)
      for (const item of cartItems) {
        await query(
          `INSERT INTO order_details (order_id, product_id, quantity, unit_price_at_order)
           VALUES ($1, $2, $3, $4)`,
          [
            orderId,
            item.product_id,
            item.quantity,
            item.price,
          ]
        );
      }

      // 5. Sepeti Temizle
      await query(`DELETE FROM cart_items WHERE cart_id = $1`, [cart.cart_id]);

      await query('COMMIT');
      return { success: true, orderId };

    } catch (e) {
      await query('ROLLBACK');
      console.error("Sipariş oluşturma hatası:", e);
      throw e;
    }
  }

  // Mevcut getOrders metoduna dokunmadan, altına bu metodu ekleyin:

  async getPastOrders({ user_id }) {
    // 1. Düz SQL Sorgusu (json_agg kullanmadan)
    const result = await query(
      `
      SELECT 
          o.order_id,
          o.status,
          o.total_price,
          o.created_at,
          -- Restoran Bilgisi
          r.name AS restaurant_name,
          r.district AS restaurant_district,
          -- Ürün Bilgisi
          p.name AS product_name,
          od.quantity,
          od.unit_price_at_order
      FROM 
          orders o
      INNER JOIN 
          restaurant r ON o.restaurant_id = r.restaurant_id
      INNER JOIN 
          order_details od ON o.order_id = od.order_id
      INNER JOIN 
          products p ON od.product_id = p.product_id
      WHERE 
          o.customer_id = $1
      ORDER BY 
          o.created_at DESC
      `,
      [user_id]
    );

    // 2. JavaScript ile Veriyi Gruplama
    const ordersMap = {};

    result.rows.forEach((row) => {
      // Sipariş daha önce listeye eklenmemişse başlığını oluştur
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          status: row.status,
          total_price: row.total_price,
          created_at: row.created_at,
          restaurant_name: row.restaurant_name,
          restaurant_district: row.restaurant_district,
          items: [],
        };
      }

      // Ürün kalemini ekle
      ordersMap[row.order_id].items.push({
        name: row.product_name,
        quantity: row.quantity,
        price: row.unit_price_at_order,
      });
    });

    // Objeyi diziye çevir
    return Object.values(ordersMap);
  }
}

export default new CustomerRepository();
