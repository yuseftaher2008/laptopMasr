import { body } from 'express-validator'

export const addToCartValidator = [
    body('product_id').notEmpty().isInt().withMessage('Invalid product id'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
]