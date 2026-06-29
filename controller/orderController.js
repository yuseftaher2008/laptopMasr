import pool from "../db.js"

export async function placeOrder (req,res){
    const user_id = req.user.id

    try {
        const userCart = await pool.query(`SELECT * FROM carts JOIN products ON carts.product_id = products.id WHERE user_id = $1`,[user_id])
        if (!userCart.rows[0]){
            return res.status(400).json({message:'No iteams in cart'})
        }
        const cartItems = userCart.rows
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
            }, 0);
        const createOrder = await pool.query(`INSERT INTO orders (user_id,total) VALUES ($1,$2) RETURNING id`,[user_id,total])
        for (const iteam of cartItems){
            await pool.query(`INSERT INTO order_items (order_id,product_id,quantity,price) VALUES ($1,$2,$3,$4) `,[createOrder.rows[0].id,iteam.product_id,iteam.quantity,iteam.price])
        }
        await pool.query(`DELETE FROM carts WHERE user_id = $1`,[user_id])
        return res.status(201).json({ message: 'Order placed successfully' })
    } catch (err) { 
        console.log (err)
        return res.status(500).json({message:'server error'})
    }     

}

export async function getOrders (req,res){
    const userId = req.user.id
    try {
        const getOrders = await pool.query(`SELECT * FROM orders WHERE user_id = $1`,[userId])
        return res.json(getOrders.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message:'server error '})
        
    } 

}

export async function getOrderById(req, res) {
    const {id} = req.params
    const userId = req.user.id
    try {
        const order = await pool.query(
            `SELECT * FROM order_items 
             JOIN products ON order_items.product_id = products.id 
             JOIN orders ON order_items.order_id = orders.id
             WHERE order_items.order_id = $1 AND orders.user_id = $2`,
            [id, userId]
        )
        if (!order.rows[0]) {
            return res.status(404).json({ message: 'Order not found' })
        }
        return res.json(order.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'server error' })
    }
}

export async function updateOrderStatus (req,res){
    const {id} = req.params
    const {status} = req.body
    
    try {
        const CheckOrder = await pool.query(`SELECT * FROM orders WHERE id = $1`,[id])
        if(!CheckOrder.rows[0]){
            return res.status(400).json({message:'no order found'})
        }
        const updatedOrder = await pool.query(`UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,[status,id])
        res.json(updatedOrder.rows[0])


    } catch (err) {
        console.log(err)
        return res.status (500).json({message:'server error'})

        
    }
}