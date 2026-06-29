import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function protect(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' })
    }

    
    const token = authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ message: 'Invalid token format' })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'server error'})
    }
    
}
export function isAdmin (req,res,next){
    
        if(req.user.role !== 'admin'){
            return res.status(400).json({message:'Access denied'})
        }
        req.user = decoded  
        next()              

    
}
