import {getAllProducts, getProductsById,addProducts, deleteProducts, updateProduct} from '../controller/productsController.js'
import { isAdmin, protect } from '../middleware/authMiddleware.js'
import { addProductValidator } from '../middleware/productValidator.js'
import { validationResult } from 'express-validator'
import express from 'express'

export const productsRouter = express.Router()
productsRouter.get('/',getAllProducts)
productsRouter.get('/:id',getProductsById)
productsRouter.post('/',protect,isAdmin,addProductValidator,addProducts)
productsRouter.delete('/:id',protect,isAdmin,deleteProducts)
productsRouter.put('/:id',protect,isAdmin,updateProduct)    