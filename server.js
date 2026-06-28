import express from 'express'
import cors from 'cors'
import { productsRouter } from './routes/productRouter.js'
import { authRouter } from './routes/authRouter.js'
import 'dotenv/config'
import path from 'path'
import { cartRouter } from './routes/cartRouter.js'

const PORT = process.env.PORT || 8000
const app = express()

app.use(cors())


app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/cart',cartRouter)

app.listen(PORT , ()=> {
    console.log(`Server is runing on port: ${PORT}`)
})