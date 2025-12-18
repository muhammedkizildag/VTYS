import customerRepository from "./customer.repository.js";
import CustomerRepository from "./customer.repository.js";

class CustomerService {
  async addProfilePhone({ customerId, phoneNumber }) {
    try {
      const customer = await CustomerRepository.addPhoneNumber({
        customerId,
        phoneNumber,
      });
      return customer;
    } catch (error) {
      console.error("Failed to add phone number.", error.message);
    }
  }

  async changeProfilePhone({ customerId, phoneNumber }) {
    try {
      if (!phoneNumber) throw new Error("Phone number is required.");
      const customer = await CustomerRepository.changePhoneNumber({
        customerId,
        phoneNumber
      });
      return customer;
    } catch (error) {
      console.error("Failed to update profile phone number.", error.message);
    }
  }

  async createAddress(data) {
    try {
      const customer = await CustomerRepository.addAddress(data);
      return customer;
    } catch (error) {
      console.error("Failed to create address.", error.message);
    }
  }

  async updateAddress({ address_id, data }) {
    try {
      const customer = await CustomerRepository.updateAddress({
        address_id,
        data,
      });
      return customer;
    } catch (error) {
      console.error("Failed to update address.", error.message);
    }
  }

  async getAddresses({ userId }) {
    try {
      const addresses = await CustomerRepository.getAddresses({ userId });
      return addresses;
    } catch (error) {
      console.error("Failed to get customer addresses.", error.message);
    }
  }

  async deleteAddress({ address_id, customer_id }) {
    try {
      const deletedAddress = await CustomerRepository.deleteAddress({
        address_id, customer_id
      });
      return deletedAddress;
    } catch (error) {
      console.error("Failed to delete customer address.", error.message);
    }
  }

  async getCart({ userId }) {
    try {
      return await CustomerRepository.getCart({ userId });
    }

    catch (e) {
      throw e;
    }
  }

  async getOrders({ user_id }) {
    try {
      const result = await customerRepository.getOrders({ user_id });
      return result;
    }

    catch (e) {

    }
  }

  async getSelectedAddress(user_id) {
    try {
      return await CustomerRepository.getSelectedAddress(user_id);
    }

    catch (e) {
      console.log(e);
    }
  }

  async getRestaurants(user_id) {
    try {
      return await CustomerRepository.getRestaurants(user_id);
    }

    catch (e) {
      throw e;
    }

  }

  async getProducts(restaurant_id) {
    try {
      const result = await CustomerRepository.getProducts(restaurant_id);

      return result;
    }

    catch (e) {

      throw e;
    }

  }


  async selectAddress({ customerId, addressId }) {
    try {
      const customer = await CustomerRepository.updateSelectedAddress({
        customerId,
        addressId
      });
      return customer;
    } catch (error) {
      console.error("Failed to select address.", error.message);
      throw error;
    }
  }

  async addToCart({ userId, restaurantId, productId }) {
    try {
      return await CustomerRepository.addToCart({ userId, restaurantId, productId });
    } catch (error) {
      console.error("Sepete ekleme hatası:", error.message);
      throw error;
    }
  }

  async getRestaurantById(restaurantId) {
    try {
      return await CustomerRepository.getRestaurantById(restaurantId);
    } catch (e) {
      throw e;
    }
  }

  async createOrder(userId) {
    try {
      return await CustomerRepository.createOrder(userId);
    } catch (e) {
      throw e;
    }
  }

  // CustomerService class'ının içine ekleyin:

  async getPastOrders({ user_id }) {
    try {
      return await CustomerRepository.getPastOrders({ user_id });
    } catch (e) {
      throw e;
    }
  }

}

export default new CustomerService();
