
import pool from "./db.js";


async function createCartTable() {

    try{
        await pool.query(`CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ,
    product_id INTEGER REFERENCES products(id) ,
    quantity INTEGER DEFAULT 1
)`)
            console.log('product table created')
    }catch(err){
        console.log('ERROR creating table', err)
    }
    
}
createCartTable()