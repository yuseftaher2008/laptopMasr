import {openDb} from '../config/db.js'
const db = await openDb()

export async function getAllProducts(req, res) {
    const { brand, minPrice, maxPrice, tags } = req.query

    try {
        let query = `SELECT * FROM products WHERE 1=1`
        const params = []

        if (brand) {
            query += ` AND brand =?`
            params.push(brand)
        }
        if (minPrice) {
            query += ` AND price >=?`
            params.push(minPrice)
        }
        if (maxPrice) {
            query += ` AND price <=?`
            params.push(maxPrice)
        }
        if (tags) {
            query += ` AND tags LIKE ?`
            params.push(`%${tags}%`)
        }

        const data = await db.all(query, params)
        return res.json(data)
    } catch (err) {
        return res.status(500).json({ message: 'Server error' })
    }
}

export async function getProductsById (req,res){
    const {id} = req.params 
    try{
        const data = await db.get('SELECT * FROM products WHERE id =?',[id])
        return res.json(data)
        if (!data) {
            return res.status(404).json({ message: 'Product not found' })
        }

    }catch(err){
        return res.status(500).json({ message: 'Server error' })
    }
}

export async function addProducts (req,res){
    const {name,brand,price,cpu,ram,storage,gpu,screen_size,stock,tags,description,image_url} = req.body
    try {
        if (!name || !brand || !price ){
            return res.status(400).json({message : `name,price,brand fileds are required`})
        }
        const params = [name,brand,price,cpu,ram,storage,gpu,screen_size,stock,tags,description,image_url]

        const result = await db.run(`INSERT INTO products (name,brand,price,cpu,ram,storage,gpu,screen_size,stock,tags,description,image_url)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,params)
            const newProduct = await db.get(`SELECT * FROM products WHERE id = ?`, [result.lastID])
            console.log(`data insered`,newProduct)    
            return res.status(201).json(newProduct)

    } catch (err) {
        return res.status(500).json({message :'Server error'})
    }
    

}

export async function deleteProducts (req,res) {
    const {id} = req.params
    try {
        const findProducts = await db.get(`SELECT * FROM products WHERE id =?`,[id])
        if (!findProducts){
            return res.status(404).json({message: 'enter a valid id'})
        }
        await db.run(`DELETE FROM products WHERE id =?`,[id])
        res.status(204).send()
    } catch (err) {
        return res.status(500).json({message:"server error"})
    }
}

export async function updateUser (req,res){
    const fields = req.body
    const {id} = req.params
    const setClauses = []
    const params = []
    const allowedFields = ['name','brand','price','cpu','ram','storage','gpu','screen_size','stock','tags','description','image_url']
    try {
        const product = await db.get(`SELECT * FROM products WHERE id = ?`,[id])
        if(!product){
            return res.status(404).json({message:'invalid product id'})
        }
        for(const field of allowedFields){
            if(fields[field] !== undefined){
                setClauses.push(`${field} =?`)
                params.push(fields[field])
            }
        }
            if(setClauses.length === 0){
                return res.status(400).json({message:'nothing to update'})
            }
            const query = `UPDATE products SET ${setClauses.join(', ')} WHERE id = ?`
            params.push(id)
            await db.run(query,params)
            const updatedProduct = await db.get(`SELECT * FROM products WHERE id = ?`, [id])
            return res.json(updatedProduct)
    }catch(err){
        return res.status(500).json({message:'Server error'})
    }
}