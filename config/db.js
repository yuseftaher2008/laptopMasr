import sqlite3 from 'sqlite3'
import {open} from 'sqlite'
import path, { dirname } from 'node:path'


export async function openDb() {
    const dbPath = await path.join('database.db')
    return open({
        filename: dbPath,
        driver:sqlite3.Database
    })
    
}
