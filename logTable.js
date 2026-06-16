import { openDb } from "./config/db.js";



async function logTable() {
    


const tableName = 'users'

const db = await openDb()
try{

    const table = await db.all(`SELECT * FROM ${tableName}`)
    console.log(table)

}catch(err){

    console.log(err)

}finally{

    await db.close()
}
}
logTable()