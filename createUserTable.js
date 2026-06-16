import { openDb } from "./config/db.js";


async function createUserTable() {
    const db = await openDb()
    try{
        await db.exec(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
)`)
        console.log('users table created')
    }catch(err){
        console.log('ERROR creating table', err)
    }
    
}
createUserTable()