import  express from 'express';
import{ getAllProducts, getFeaturedProducts }from '../controllers/product.controllers.js'
import { protectRoute,adminRoute } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts ); //protectRoute accessToken dogrulayan admin. adminRoute  
                                                            //  admin iznine sahip olanlar gorecek

router.get("/featured", getFeaturedProducts);                                                            

export default router;