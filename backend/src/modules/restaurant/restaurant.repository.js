import { query } from "../../utils/db.js";

class RestaurantRepository {
  async addRestaurantInfo({ owner_id, data }) {

    const { name, description, min_order_price, city, district, full_address } = data;
    const result = await query(
      `
    INSERT INTO restaurant (
        owner_id, 
        name, 
        description, 
        min_order_price, 
        city, 
        district, 
        full_address
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
      [
        owner_id,
        name,
        description,
        min_order_price,
        city,        // Değişkenlerin tanımlı olduğundan emin ol
        district,    // Migration'da NOT NULL olduğu için zorunlu
        full_address
      ]
    );
    return result.rows;
  }

  async getRestaurantInfo({ owner_id }) {
    const result = await query(
      `
      SELECT *
      FROM restaurant
      WHERE owner_id = $1
      `,
      [owner_id]
    );
    return result.rows;
  }

  async changeRestaurantInfo({ owner_id, data }) {
    const { name, description, min_order_price } = data;

    const result = await query(
      `
      UPDATE restaurant
      SET 
        name = $1,
        description = $2,
        min_order_price = $3
      WHERE owner_id = $4
      RETURNING *;
    `,
      [name, description, min_order_price, owner_id]
    );

    return result.rows[0];
  }

  async addRestaurantProduct({ restaurant_id, data }) {
    let { name, price, isAvailable, description, image } = data;

    console.log(isAvailable)

    isAvailable = isAvailable ? 'available' : 'unavailable';
    console.log(restaurant_id)
    try {
      console.log(data)
      const result = await query(
        `
      INSERT INTO products (restaurant_id, name, unit_price, status, description, category ,image_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
        [restaurant_id, name, price, isAvailable, description, image]
      );
      console.log(result.rows);
      return result.rows[0];

    }

    catch (e) {
      console.log(e);
    }
  }

  async changeRestaurantProduct({ product_id, data }) {
    const result = await query(
      `
      UPDATE 
      `
    )
  }

  async deleteRestaurantProduct({ product_id, restaurant_id }) {
    const result = await query(
      `
      DELETE FROM products
      WHERE product_id = $1 AND restaurant_id = $2
      RETURNING *
      `,
      [product_id, restaurant_id]
    );
    return result.rows[0];
  }

  async getRestaurantProduct({ restaurant_id }) {
    const result = await query(
      `
      SELECT *
      FROM products
      WHERE restaurant_id = $1
      `,
      [restaurant_id]
    );

    return result.rows;
  }

  async getRestaurantDashboard({ owner_id, restaurant_id }) {
    try {
      const result = await query(`
        SELECT 
        -- 1. Toplam Ciro
        COALESCE(SUM(total_price), 0) as turnover,

        -- 2. Toplam Sipariş Sayısı
        COUNT(*) as total_order_count,

        -- 3. Yeni Müşteri Sayısı (İlk Kez Sipariş Verenler)
        COUNT(DISTINCT customer_id) FILTER (
            WHERE customer_id NOT IN (
                SELECT customer_id 
                FROM orders 
                WHERE restaurant_id = $1 
                  AND created_at < CURRENT_DATE -- Bugünden eski siparişler
                  AND status != 'cancelled'
            )
        ) as new_customer_count

        FROM 
            orders
        WHERE 
            restaurant_id = $1
            AND created_at::date = CURRENT_DATE -- Sadece bugünün kayıtları
            AND status != 'cancelled'
      `, [restaurant_id]);

      const result2 = await query(`
        SELECT 
            o.order_id,
            u.name AS customer_name,       -- Müşteri Adı (Ahmet Yılmaz)
            o.total_price,                 -- Tutar (325.00)
            o.status,                      -- Durum (preparing, pending vs.)
            TO_CHAR(o.created_at, 'HH24:MI') AS order_time  -- Zaman (14:31 formatında)
        FROM 
            orders o
        JOIN 
            users u ON o.customer_id = u.user_id
        WHERE 
            o.restaurant_id = $1           -- Hangi restoranın paneli ise
        ORDER BY 
            o.created_at DESC              -- En yeniden eskiye
        LIMIT 5                            -- Son 5 veya 10 sipariş
      `, [restaurant_id]);

      console.log(result2.rows)

      return { ...result.rows[0], orders: result2.rows };
    }
    catch (e) {
      console.log(e);
    }
  }

  async updateProduct(productId, restaurantId, data) {
    // Dinamik Update Sorgusu Oluşturma
    const fields = [];
    const values = [];
    let i = 1;

    // Sadece gelen dolu verileri güncelle
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) { // null değerleri kabul edebiliriz (resim silmek için) ama undefined'ı atlarız
        if (key == 'restaurant_id') continue;
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
      }
    }

    // Eğer güncellenecek veri yoksa erken dön
    if (fields.length === 0) return null;

    values.push(productId);
    values.push(restaurantId); // Güvenlik: Sadece o restoranın ürünü güncellenebilir

    const queryText = `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE product_id = $${i} AND restaurant_id = $${i + 1}
      RETURNING *
    `;
    console.log(queryText);
    try {
      const result = await query(queryText, values);
      return result.rows[0];
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

async getRestaurantOrders(restaurant_id) {
    // 1. Düz SQL Sorgusu (json_agg yok)
    const result = await query(`
      SELECT 
          o.order_id,
          o.status,
          o.total_price,
          o.created_at,
          -- Müşteri Bilgileri
          u.name as customer_name,
          u.email as customer_email,
          -- Adres Bilgileri
          a.title as address_title,
          a.district,
          a.neighbourhood,
          a.street,
          a.number,
          -- Ürün Detayları (Her satırda tek ürün gelecek)
          p.name as product_name,
          od.quantity,
          od.unit_price_at_order
      FROM orders o
      INNER JOIN users u ON o.customer_id = u.user_id
      LEFT JOIN address a ON o.address_id = a.address_id
      INNER JOIN order_details od ON o.order_id = od.order_id
      INNER JOIN products p ON od.product_id = p.product_id
      WHERE o.restaurant_id = $1
      ORDER BY o.created_at DESC
    `, [restaurant_id]);

    // 2. JavaScript ile Veriyi Gruplama (Mapping)
    const ordersMap = {};

    result.rows.forEach(row => {
      // Eğer sipariş map'te yoksa, ana iskeleti oluştur
      if (!ordersMap[row.order_id]) {
        ordersMap[row.order_id] = {
          order_id: row.order_id,
          status: row.status,
          total_price: row.total_price,
          created_at: row.created_at,
          customer_name: row.customer_name,
          customer_email: row.customer_email,
          address: {
            title: row.address_title,
            district: row.district,
            neighbourhood: row.neighbourhood,
            street: row.street,
            number: row.number
          },
          items: [] // Ürünleri burada toplayacağız
        };
      }

      // Ürünü ilgili siparişin listesine ekle
      ordersMap[row.order_id].items.push({
        name: row.product_name,
        quantity: row.quantity,
        price: row.unit_price_at_order
      });
    });

    // Map yapısını array'e çevirip döndür
    return Object.values(ordersMap);
  }

  // Sipariş durumu güncelleme (Aynı kalabilir, şemaya uygun)
  async updateOrderStatus(order_id, status) {
    const result = await query(`
      UPDATE orders
      SET status = $1
      WHERE order_id = $2
      RETURNING *
    `, [status, order_id]);

    return result.rows[0];
  }




}

export default new RestaurantRepository();
