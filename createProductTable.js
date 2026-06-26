
import pool from "./db.js";


async function createProductTable() {

    try{
        await pool.query(`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price NUMERIC NOT NULL,
    cpu TEXT,
    ram INTEGER,
    storage INTEGER,
    gpu TEXT,
    screen_size NUMERIC,
    stock INTEGER DEFAULT 0,
    tags TEXT,
    description TEXT,
    image_url TEXT
)`)
            console.log('product table created')
    }catch(err){
        console.log('ERROR creating table', err)
    }
    
}
createProductTable()