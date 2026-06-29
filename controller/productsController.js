import pool from '../db.js'
import { validationResult } from 'express-validator'




export async function getAllProducts(req, res) {
    const { brand, minPrice, maxPrice, tags } = req.query

    try {
        let query = `SELECT * FROM products WHERE 1=1`
        const params = []
        let noOfValues = 0
        if (brand) {
            noOfValues ++
            query += ` AND brand =$${noOfValues}`
            params.push(brand)
        }
        if (minPrice) {
            noOfValues ++
            query += ` AND price >=$${noOfValues}`
            params.push(minPrice)
        }
        if (maxPrice) {
            noOfValues ++
            query += ` AND price <=$${noOfValues}`
            params.push(maxPrice)
        }
        if (tags) {
            noOfValues ++
            query += ` AND tags LIKE $${noOfValues}`
            params.push(`%${tags}%`)
        }

        const data = await pool.query(query, params)
        return res.json(data.rows)
    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

export async function getProductsById (req,res){
    const {id} = req.params 
    try{
        const data = await pool.query('SELECT * FROM products WHERE id =$1',[id])
        const result = data.rows[0]
        
        if (!result) {
            return res.status(404).json({ message: 'Product not found' })
        }
     return res.json(result)

    }catch(err){
        return res.status(500).json({ message: 'Server error' })
    }
}

export async function addProducts (req,res){
    const {name,brand,price,cpu,ram,storage,gpu,screen_size,stock,tags,description,image_url} = req.body
    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }try {

        const params = [name,brand,price,cpu,ram,storage,gpu,screen_size,stock,tags,description,image_url]

        const result = await pool.query(`INSERT INTO products (name,brand,price,cpu,ram,storage,gpu,screen_size,stock,tags,description,image_url)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id,name,brand,price`,params)
            
            console.log(`data insered`,result.rows[0])    
            return res.status(201).json(result.rows[0])

    } catch (err) {
        return res.status(500).json({message :'Server error'})
    }
    

}

export async function deleteProducts (req,res) {
    const {id} = req.params
    try {
        const findProducts = await pool.query(`SELECT * FROM products WHERE id =$1`,[id])
        const result = findProducts.rows[0]
        if (!result){
            return res.status(404).json({message: 'enter a valid id'})
        }
        await pool.query(`DELETE FROM products WHERE id =$1`,[id])
        res.status(204).send()
    } catch (err) {
        return res.status(500).json({message:"server error"})
    }
}

export async function updateProduct (req,res){
    const fields = req.body
    const {id} = req.params
    const setClauses = []
    let noOfValues = 0
    const params = []
    const allowedFields = ['name','brand','price','cpu','ram','storage','gpu','screen_size','stock','tags','description','image_url']
    try {
        const product = await pool.query(`SELECT * FROM products WHERE id = $1`,[id])
        const result = product.rows[0]
        if(!result){
            return res.status(404).json({message:'invalid product id'})
        }
        for(const field of allowedFields){
            if(fields[field] !== undefined){
                noOfValues ++ 
                setClauses.push(`${field} =$${noOfValues}`)
                params.push(fields[field])
            }
        }
            if(setClauses.length === 0){
                return res.status(400).json({message:'nothing to update'})
            }
            noOfValues ++
            let query = `UPDATE products SET ${setClauses.join(', ')} WHERE id = ${noOfValues}`
            params.push(id)
            query += ` RETURNING id,name,brand,price`
            const updatedProduct = await pool.query(query,params)
            return res.json(updatedProduct.rows[0])
    }catch(err){
        return res.status(500).json({message:'Server error'})
    }
}