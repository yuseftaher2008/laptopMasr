import {getAllProducts, getProductsById,addProducts, deleteProducts, updateProduct} from '../controller/productsController.js'
import { isAdmin, protect } from '../middleware/authMiddleware.js'
import express from 'express'

export const productsRouter = express.Router()
productsRouter.get('/',getAllProducts)
productsRouter.get('/:id',getProductsById)
productsRouter.post('/',protect,isAdmin,addProducts)
productsRouter.delete('/:id',protect,isAdmin,deleteProducts)
productsRouter.put('/:id',protect,isAdmin,updateProduct)    