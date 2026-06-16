import {getAllProducts, getProductsById,addProducts, deleteProducts, updateUser} from '../controller/productsController.js'
import { authMiddleware } from '../middleware/authMiddleware..js'
import express from 'express'

export const productsRouter = express.Router()
productsRouter.get('/',getAllProducts)
productsRouter.get('/:id',getProductsById)
productsRouter.post('/',authMiddleware,addProducts)
productsRouter.delete('/:id',authMiddleware,deleteProducts)
productsRouter.put('/:id',authMiddleware,updateUser)    