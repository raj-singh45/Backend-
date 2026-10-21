import {Router} from "express"
import { authenticate } from "../middlewares/auth.middleware";
import { addToCart, getCart } from "../controller/cart.controller";

const router = Router() ;

/**
 * @method POST
 * @route /api/cart
 * @access protected
 * @description Add an  product to the user's cart
 */
  router.post("/", authenticate, addToCart);


  /**
 * @method GET
 * @route /api/cart
 * @access protected
 * @description Get the user's cart
 */
  router.get("/", authenticate,getCart)
  

export default router