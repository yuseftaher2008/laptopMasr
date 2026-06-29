
import { validationResult } from 'express-validator'
import pool from "../db.js"

export async function addToCart (req,res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {product_id,quantity} = req.body
    const user_id = req.user.id
    
    try{
       const checkProduct =  await pool.query(`SELECT * FROM products WHERE id=$1`,[product_id])
       if (!checkProduct.rows[0]){
        return res.status(400).json({message:'product not found'})
       }
       const checkCart = await pool.query(`SELECT * FROM carts WHERE user_id=$1 AND product_id=$2`,[user_id,product_id])
       if (checkCart.rows[0]){
        await pool.query(`UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3`,[quantity,user_id,product_id])
        return res.json({message:'quantity updated'})
       }
       const result = await pool.query(`INSERT INTO carts (user_id,product_id,quantity) VALUES ($1,$2,$3) RETURNING *`,[user_id,product_id,quantity])
       console.log('added to carts ')
       return res.status(201).json(result.rows[0])

    }catch(err){
        console.log(err)
        return res.status(500).json({message:'server error'})
}
}

export async function getCart (req,res){
    const user_id = req.user.id
    try {
            const result = await pool.query(`SELECT carts.id, carts.quantity, products.name, products.price, products.image_url FROM carts JOIN products ON carts.product_id = products.id WHERE carts.user_id = $1`,[user_id])
            return res.json(result.rows)

    } catch (err) {
        console.log(err)
        return res.status(500).json({message:'server error'})
        
    }
}

export async function removeFromCart (req,res){
    const {id} = req.params
    const user_id = req.user.id
    try {
        const checkUser = await pool.query(`SELECT * FROM carts WHERE id=$1 AND user_id=$2`,[id,user_id])

        if (!checkUser.rows[0]){
            return res.status(400).json({message:"invaild carts no"})
        }
        const result = await pool.query(`DELETE FROM carts WHERE id=$1`,[id])
        return res.status(204).send()

    } catch (err) {
        console.log(err)
        return res.status(500).json({message:'server error'})
        
    }
}