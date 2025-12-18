import RestaurantRepository from "../modules/restaurant/restaurant.repository.js";

export async function attachRestaurant(req, res, next) {
  try {
    const owner_id = req.user.id;

    const restaurant = await RestaurantRepository.getRestaurantInfo({
      owner_id,
    });

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    req.restaurant_id = restaurant;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
