import {db} from "../libs/db.js"
import { ApiResponse } from "../utils/api-response.js";
import { verifyJWTToken } from "../utils/jwt-token.js";

export const isLoggedIn = async (req , res , next)=>{
    try {
        const token = req.cookies.jwt
        console.log("JWT Token : ", token);
        
        if(!token){
            return res.status(400).json(new ApiResponse(400, "Unauthorized - No token provided"))
        }

        // console.log("Just before Decoded Token")
        const decoded = verifyJWTToken(token)
        // console.log("Decoded Token : ", decoded);
        
        
        const user = await db.user.findUnique({
            where:{id:decoded.id},
            select:{id:true, image:true, name:true, email:true, role:true}
        })
        if(!user){
            return res.status(400).json(new ApiResponse(400, "User is not found"))
        }
        req.user = user
        next()

    }
    catch (error) {
        console.error("Error authenticating user:", error.message)
        res.status(500).json(new ApiResponse(500, "Error authenticating user"))
    }
}