import express from "express"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.routes.js"
import productsRoutes from "../routes/products.routes.js"
import cartRoutes from "../routes/cart.routes.js"
const app = express() ;
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/products",productsRoutes)
app.use("/api/cart", cartRoutes)


export default app ;