import express from "express"
import { check, login, logout, register } from "../controllers/auth.controllers.js"

const authRoute = express.Router()

authRoute.post("/register", register)
authRoute.post("/login", login)
authRoute.get("/logout", logout)
authRoute.get("/check", check)

export default authRoute