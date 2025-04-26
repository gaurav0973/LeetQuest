import express from "express"
import { check, login, logout, register } from "../controllers/auth.controllers.js"
import { isLoggedIn } from "../middleware/auth.middleware.js"

const authRoute = express.Router()

authRoute.post("/register", register)
authRoute.post("/login", login)
authRoute.get("/logout", isLoggedIn, logout)
authRoute.get("/check", isLoggedIn, check)

export default authRoute