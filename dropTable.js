import { openDb } from "./config/db.js";

async function dropTable() {
    
    
    const db = await openDb()
    try{
        return await db.run('DROP TABLE IF EXISTS products')
    }catch(err){
        console.log(Error)

    }finally{
        await db.close()
    }
}


dropTable()
