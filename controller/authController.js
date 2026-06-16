import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { openDb } from '../config/db.js'

const db = await openDb()

export async function userRegister (req,res){
    let {name,username,email,password} = req.body
    if (!name || !username || !email || !password){
        return res.status(400).json({message:'All fields are required'})
    }
    username = username.trim()
    email = email.trim()
    try{
        const findUser = await db.get(`SELECT * FROM users WHERE username =? OR email =?`,[username,email])
        if(findUser){
            return res.status(400).json({message:'username or email already exists'})

        }
        const hashedPassword = await bcrypt.hash(password,10)
        const result = await db.run(`INSERT INTO users (name,username,email,password) VALUES (?,?,?,?)`,[name,username,email,hashedPassword])
        const createdUser = await db.get(`SELECT id, name, username, email FROM users WHERE id = ?`, [result.lastID])
        return res.status(201).json(createdUser)

    }catch(err){
        return res.status(500).json({message:'server error'})
    }

}


export async function loginUser (req,res) {
    const {username , password} = req.body
    if(!username || !password){
        return res.status(400).json({message:'All fields are required'})
    }
    try{
        const findUser = await db.get(`SELECT * FROM users WHERE username =?`,[username])
        
        if(!findUser){
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const checkPassword = await bcrypt.compare(password,findUser.password)
        if(!checkPassword){
            return res.status(401).json({message: 'Invalid credentials'})
        }
        const token = jwt.sign(
            {id: findUser.id , username: findUser.username ,role: findUser.role},
            process.env.JWT_SECRET ,
            {
                expiresIn:'7d'
            }
            
        )
        return res.json({ token })
    }catch(err){
        return res.status(500).json({message:'server error'})
    }
    
}