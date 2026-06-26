import pool from './db.js'

async function createUserTable() {
    try {
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer'
        )`)
        console.log('users table created')
    } catch(err) {
        console.log('ERROR creating table', err)
    }
}

createUserTable()