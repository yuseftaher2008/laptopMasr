import pool from "./db.js"


async function createOrderTable(){

    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            total NUMERIC,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
            )`)
    } catch (err) {
        console.log(err)
        
    }
    console.log('order table created')
}

async function createOrderItemTable(){

    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER,
            price NUMERIC

            )`)
    } catch (err) {
        console.log(err)
        
    }
    console.log('order item table created')
}

(async () => {
    await createOrderTable()
    await createOrderItemTable()
})()
