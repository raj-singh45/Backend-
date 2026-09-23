import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.routes.js"
import productsRoutes from "../routes/products.routes.js"
const app = express() ;
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/products",productsRoutes)


export default app ;