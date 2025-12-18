import Router from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import verifyRole from "../../middlewares/verifyRole.js";
import CustomerController from "./customer.controller.js";
import decodeToken from "../../middlewares/decodeToken.js";

const router = Router();

router.use(verifyToken, verifyRole(["CUSTOMER"]));
router.use(decodeToken);


router.get('/selected-address', CustomerController.getSelectedAddress);

router.get('/profile', CustomerController.getProfileData);




router.post("/phone", CustomerController.addProfilePhone);
router.put("/phone", CustomerController.updateProfilePhone);

router.get("/address", CustomerController.getAddresses);
router.post("/address", CustomerController.createAddress);
router.put("/address/:id", CustomerController.updateAddress);
router.delete("/address", CustomerController.deleteAddress);

router.post("/select-address", CustomerController.selectAddress);


router.post('/cart', CustomerController.addToCart);

router.get('/get-restaurants', CustomerController.getRestaurants);
router.get('/get-restaurant/:id', CustomerController.getRestaurantById);
router.get('/get-products', CustomerController.getProducts);

router.get('/past-orders', CustomerController.getPastOrders);


router.get('/cart', CustomerController.getCart);
router.post('/create-order', CustomerController.createOrder);

export default router;
