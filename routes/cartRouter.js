import { addToCart,removeFromCart,getCart } from "../controller/cartController.js";
import express from 'express'
import { protect } from "../middleware/authMiddleware.js";
export const cartRouter = express.Router()

cartRouter.get ('/',protect,getCart)
cartRouter.post ('/',protect,addToCart)
cartRouter.delete('/:id',protect,removeFromCart)