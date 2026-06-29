import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import  pool  from '../db.js'
import { validationResult } from 'express-validator'




export async function userRegister (req,res){

    let {name,username,email,password} = req.body    
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    username = username.trim()
    email = email.trim()
    try{
        const findUser = await pool.query(`SELECT * FROM users WHERE username =$1 OR email =$2`,[username,email])
        const user = findUser.rows[0]
        if(user){
            return res.status(400).json({message:'username or email already exists'})

        }
        const hashedPassword = await bcrypt.hash(password,10)
        const result = await pool.query(`INSERT INTO users (name,username,email,password) VALUES ($1,$2,$3,$4) RETURNING id,name,username,email`,[name,username,email,hashedPassword])
        
        
        return res.status(201).json(result.rows[0])

    }catch(err){
        return res.status(500).json({message:'server error'})
    }

}


export async function loginUser (req,res) {
    const {username , password} = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try{
        const findUser = await pool.query(`SELECT * FROM users WHERE username =$1`,[username])
        const user = findUser.rows[0]
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials' })
        }
        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
            return res.status(401).json({message: 'Invalid credentials'})
        }
        const token = jwt.sign(
            {id: user.id , username: user.username ,role: user.role},
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