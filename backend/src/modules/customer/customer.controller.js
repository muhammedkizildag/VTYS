import config from "../../utils/config.js";
import CustomerService from "./customer.service.js";

class CustomerController {

  async getSelectedAddress(req, res) {

    const user_id = req.userData.user_id
    try {
      const result = await CustomerService.getSelectedAddress(user_id);
      console.log(result.rows[0])
      res.status(201).json(result.rows);
    }

    catch (e) {
      console.log(e);
    }

  }


  async getProfileData(req, res) {


    const orders = await CustomerService.getOrders({ user_id: req.userData.user_id });
    console.log(orders);

    const data = {
      name: req.userData.name,
      email: req.userData.email,
      orders: orders
    }

    res.status(200).json(data);

  }

  async addProfilePhone(req, res) {
    try {
      const customerId = req.user.id;
      const { phoneNumber } = req.body;
      const customer = await CustomerService.addProfilePhone({
        customerId,
        phoneNumber,
      });
      res.json({ success: true, customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateProfilePhone(req, res) {
    const customerId = req.user.id;
    const { phoneNumber } = req.body;
    const customer = await CustomerService.changeProfilePhone({
      customerId,
      phoneNumber,
    });
    res.json({ success: true, customer });
  }

  async createAddress(req, res) {
    try {
      const customerId = req.userData.user_id;

      const data = { customerId, ...req.body };

      const customer = await CustomerService.createAddress(data);
      res.json({ success: true, customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateAddress(req, res) {
    try {
      const address_id = req.params.id;

      const data = {
        ...req.body,
      };

      const customer = await CustomerService.updateAddress({
        address_id,
        data,
      });
      res.json({ success: true, customer });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAddresses(req, res) {
    try {
      const userId = req.userData.user_id;
      const addresses = await CustomerService.getAddresses({ userId });
      res.json({ success: true, addresses });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteAddress(req, res) {
    const userID = req.userData.user_id;
    console.log()
    try {
      const { address_id } = req.body
      const deletedAddress = await CustomerService.deleteAddress({
        address_id, customer_id: userID
      });
      res.json({ success: true, deletedAddress });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getCart(req, res) {
    try {
      const result = await CustomerService.getCart({ userId: req.userData.user_id })
      return res.status(201).json(result);
    }

    catch (e) {
      res.status(401)
    }
  }

  async getRestaurants(req, res) {
    try {
      const user_id = req.userData.user_id;
      const result = await CustomerService.getRestaurants(user_id);
      res.status(201).json(result)
    }
    catch (e) {
      res.status(401);
    }
  }

  async getProducts(req, res) {
    try {
      const restaurant_id = req.query.restaurant_id;
      const result = await CustomerService.getProducts(restaurant_id);
      res.status(201).json(result);
    }
    catch (e) {
      res.status(401);
    }

  }


  async selectAddress(req, res) {
    try {
      console.log('as')
      const customerId = req.userData.user_id;
      const { address_id } = req.body;

      if (!address_id) {
        return res.status(400).json({ success: false, message: "Address ID is required" });
      }

      const result = await CustomerService.selectAddress({
        customerId,
        addressId: address_id
      });

      res.json({ success: true, message: "Address selected successfully", result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const userId = req.userData.user_id;
      const { restaurant_id, product_id, quantity } = req.body;

      if (!restaurant_id || !product_id) {
        return res.status(400).json({ success: false, message: "Eksik bilgi." });
      }

      const result = await CustomerService.addToCart({
        userId,
        restaurantId: restaurant_id,
        productId: product_id
      });
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      const result = await CustomerService.getRestaurantById(id);
      
      if (!result) {
        return res.status(404).json({ success: false, message: "Restoran bulunamadı" });
      }
      
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async createOrder(req, res) {
    try {
      const userId = req.userData.user_id;

      // Veritabanında ödeme yöntemi veya not alanı olmadığı için sadece siparişi oluşturuyoruz.
      const result = await CustomerService.createOrder(userId);
      console.log(result);
      res.status(201).json({ 
        success: true, 
        message: "Siparişiniz başarıyla alındı!", 
        order_id: result.orderId 
      });

    } catch (e) {
      console.log(e)
      res.status(400).json({ success: false, message: e.message });
    }
  }

  // CustomerController class'ının içine ekleyin:

  async getPastOrders(req, res) {
    try {
      const user_id = req.userData.user_id;
      const result = await CustomerService.getPastOrders({ user_id });
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }
}

export default new CustomerController();
