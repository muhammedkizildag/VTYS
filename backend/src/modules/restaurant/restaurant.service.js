import RestaurantRepository from "./restaurant.repository.js";

class RestaurantService {
  async addRestaurantInfo({ owner_id, data }) {
    // const existing_restaurant = await RestaurantRepository.getRestaurantInfo({
    //   owner_id,
    // });
    // if (existing_restaurant) {
    //   const error = new Error("Restaurant already exists.");
    //   error.status = 400;
    //   return error;
    // }

    const restaurant_info = await RestaurantRepository.addRestaurantInfo({
      owner_id,
      data,
    });
    return restaurant_info;
  }

  async getRestaurantInfo({ owner_id }) {
    const restaurant_info = await RestaurantRepository.getRestaurantInfo({
      owner_id,
    });
    return restaurant_info;
  }

  async changeRestaurantInfo({ owner_id, data }) {
    const restaurant_info = await RestaurantRepository.changeRestaurantInfo({
      owner_id,
      data,
    });
    return restaurant_info;
  }

  async addRestaurantProduct({ restaurant_id, data }) {
    const restaurant_product = await RestaurantRepository.addRestaurantProduct({
      restaurant_id,
      data,
    });
    return restaurant_product;
  }

  async getRestaurantProduct({ restaurant_id }) {
    const resturant_product = await RestaurantRepository.getRestaurantProduct({
      restaurant_id,
    });
    return resturant_product;
  }

  async deleteRestaurantProduct({ product_id, restaurant_id }) {
    const deletedProduct = await RestaurantRepository.deleteRestaurantProduct({
      product_id,
      restaurant_id
    });
    return deletedProduct;
  }

  async getRestaurantDashboard({ owner_id, restaurant_id }) {
    const res = await RestaurantRepository.getRestaurantDashboard({ owner_id, restaurant_id });
    return res;
  }

  async updateRestaurantProduct(productId, restaurantId, data) {
    try {
      // İş mantığı: Fiyat 0'dan küçük olamaz vs. buraya eklenebilir.
      return await RestaurantRepository.updateProduct(productId, restaurantId, data);
    } catch (e) {
      throw e;
    }
  }

  async getRestaurantOrders(restaurant_id) {
    return await RestaurantRepository.getRestaurantOrders(restaurant_id);
  }

  async updateOrderStatus({ order_id, status }) {
    return await RestaurantRepository.updateOrderStatus(order_id, status);
  }
}

export default new RestaurantService();
