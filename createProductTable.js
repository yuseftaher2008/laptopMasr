
import { openDb } from "./config/db.js";


async function createProductTable() {
    const db = await openDb()
    try{
        await db.exec(`CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price REAL NOT NULL,
    cpu TEXT,
    ram INTEGER,
    storage INTEGER,
    gpu TEXT,
    screen_size REAL,
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