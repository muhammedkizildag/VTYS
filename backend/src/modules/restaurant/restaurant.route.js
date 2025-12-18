import Router from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import RestaurantController from "./restaurant.controller.js";
import decodeToken from "../../middlewares/decodeToken.js";

const router = Router();

router.use(verifyToken, decodeToken);

router.post("/info", RestaurantController.addRestaurantInfo);
router.get("/info", RestaurantController.getRestaurantInfo);
router.put("/info", RestaurantController.changeRestaurantInfo);


router.get('/get-restaurant-dashboard/:id', RestaurantController.getRestaurantDashboard);

router.get(
  "/products",
  RestaurantController.getRestaurantProduct
);
router.post(
  "/products",
  RestaurantController.addRestaurantProduct
);

router.put(
  "/products/:id", 
  RestaurantController.updateRestaurantProduct
);

router.delete(
  "/products/:id",
  RestaurantController.deleteRestaurantProduct
);

router.get("/:restaurantId/orders", RestaurantController.getOrders);
router.put("/order/:orderId/status", RestaurantController.updateOrderStatus);


export default router;
