
import  express  from 'express';
import {addToCart, removeAllFromCart, updateQuantity,getCartProducts} from '../controllers/cart.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();


router.get("/", protectRoute, getCartProducts);// protectRoute musteriler icindir
router.post("/", protectRoute, addToCart);// protectRoute musteriler icindir
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuantity);


export default router; 