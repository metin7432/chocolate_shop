import  express from 'express';
import{ 
    getAllProducts, 
    getFeaturedProducts,
    createProduct,deleteProduct, 
    getRecommededProduct, 
    getProductsByCategory, 
    toggleFeaturedProduct }from '../controllers/product.controllers.js'

import { protectRoute,adminRoute } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts ); //protectRoute ve adminRoute accessToken dogrulayan admin iznine sahip olanlar gorecek
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);



export default router;