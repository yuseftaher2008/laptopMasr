import express from 'express'
import { getOrderById,getOrders,updateOrderStatus,placeOrder } from '../controller/orderController.js'
import { isAdmin, protect } from '../middleware/authMiddleware.js'

export const orderRouter = express.Router()


orderRouter.get('/',protect,getOrders)
orderRouter.get('/:id',protect,getOrderById)
orderRouter.post('/',protect,placeOrder)
orderRouter.put('/:id',protect,isAdmin,updateOrderStatus)
