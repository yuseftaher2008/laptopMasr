import express from 'express'
import { userRegister,loginUser } from '../controller/authController.js'

export const authRouter = express.Router()

authRouter.post('/register',userRegister)

authRouter.post('/login',loginUser)