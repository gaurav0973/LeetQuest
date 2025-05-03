import express from "express"
import { isLoggedIn } from "../middleware/auth.middleware.js"
import { executeCode } from "../controllers/executeCode.controllers.js"


const executionRoute = express.Router()


executionRoute.post("/", isLoggedIn, executeCode)



export default executionRoute