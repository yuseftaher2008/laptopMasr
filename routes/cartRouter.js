import { addToCart,removeFromCart,getCart } from "../controller/cartController.js";
import { protect } from "../middleware/authMiddleware.js";
import { addToCartValidator } from "../middleware/cartValidator.js";
import express from 'express'
export const cartRouter = express.Router()

cartRouter.get ('/',protect,getCart)
cartRouter.post ('/',addToCartValidator,protect,addToCart)
cartRouter.delete('/:id',protect,removeFromCart)