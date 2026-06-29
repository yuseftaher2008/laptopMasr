import express from 'express'
import { userRegister,loginUser } from '../controller/authController.js'
import { registerValidator, loginValidator } from '../middleware/authValidator.js'
import { validationResult } from 'express-validator'

export const authRouter = express.Router()

authRouter.post('/register',registerValidator,userRegister)

authRouter.post('/login',loginValidator,loginUser)