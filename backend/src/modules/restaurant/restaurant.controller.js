import RestaurantService from "./restaurant.service.js";

class RestaurantController {
  async addRestaurantInfo(req, res) {
    try {
      const owner_id = req.userData.user_id;
      const data = req.body;

      if (!data || !data.name) {
        return res.status(400).json({
          success: false,
          message: "Restaurant data is missing or incomplete",
        });
      }

      const restaurant = await RestaurantService.addRestaurantInfo({
        owner_id,
        data,
      });

      return res.status(201).json({ success: true, restaurant });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getRestaurantInfo(req, res) {
    try {
      const owner_id = req.userData.user_id;
      const restaurant = await RestaurantService.getRestaurantInfo({
        owner_id,
      });
      return res.status(200).json({ success: true, restaurant });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async changeRestaurantInfo(req, res) {
    try {
      const owner_id = req.user.id;
      const data = req.body;
      const restaurant = await RestaurantService.getRestaurantInfo({
        owner_id,
        data,
      });
      return res.status(200).json({ success: true, restaurant });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async addRestaurantProduct(req, res) {

    try {
      const restaurant_id = req.query.restaurant_id;
      const data = req.body;
      console.log(data);
      const restaurant = await RestaurantService.addRestaurantProduct({
        restaurant_id,
        data,
      });
      return res.status(201).json(restaurant);
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getRestaurantProduct(req, res) {
    try {
      console.log(req.query.restaurant_id)
      const restaurant_id = req.query.restaurant_id;
      const restaurant_products = await RestaurantService.getRestaurantProduct({
        restaurant_id,
      });
      return res.status(200).json(restaurant_products);
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteRestaurantProduct(req, res) {
    try {
      const { restaurant_id } = req.restaurant_id;
      const { product_id } = req.params.id;
      const deletedProduct = await RestaurantService.deleteRestaurantProduct({
        product_id,
        restaurant_id,
      });
      return res.status(204).json({});
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  async getRestaurantDashboard(req, res) {
    try {
      const owner_id = req.userData.user_id;
      const restaurant_id = req.params.id;
      const r = await RestaurantService.getRestaurantDashboard({ owner_id, restaurant_id });
      console.log(r);

      res.status(200).json(r);
    }

    catch (e) {
      console.log(e);
    }

  }

  async updateRestaurantProduct(req, res) {
    try {
      const productId = req.params.id; // URL'den gelen ID
      const restaurantId = req.body.restaurant_id; // Token'dan gelen Restoran ID

      const data = req.body; // Body'den gelen güncel veriler

      const updatedProduct = await RestaurantService.updateRestaurantProduct(
        productId,
        restaurantId,
        data
      );

      if (!updatedProduct) {
        return res.status(404).json({ success: false, message: "Ürün bulunamadı veya güncelleme yapılamadı." });
      }

      res.status(200).json({ success: true, product: updatedProduct });
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async getOrders(req, res) {
    try {
      const { restaurantId } = req.params;
      const orders = await RestaurantService.getRestaurantOrders(restaurantId);
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const result = await RestaurantService.updateOrderStatus({ order_id: orderId, status });
      res.status(200).json({ success: true, order: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

}

export default new RestaurantController();
