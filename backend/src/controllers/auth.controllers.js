import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js"
import db from "../libs/db.js"
import { hashThePassword } from "../utils/hash-password.js";
import { UserRole } from "../generated/prisma/index.js";
import { generateJWTToken } from "../utils/jwt-token.js";



export const register = async(req,res) => {

    const {name, email, password} = req.body
    try {
        const existingUser = await db.user.findUnique({where : {email : email}})
        if(existingUser){
            return res.status(400).json(new ApiResponse(400, "User already existed"))
        }

        const hashedPassword = hashThePassword(password)
        const newUser = await db.user.create({
            data : {
                name : name,
                email : email,
                password : hashedPassword,
                role : UserRole.USER
            }
        })

        const token = generateJWTToken(newUser)
        res.cookie("jwt", token, {
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development",
            maxAge:1000 * 60 * 60 * 24 * 7
        })

        return res.status(200).json(
            new ApiResponse(200, "User Registered Successfully")
        )

    } 
    catch(error){
        console.error("Error creating new User : ", error)
        throw new ApiError(400, "Error Registering the user")
    }
}

export const login = async (req, res) => {
    res.send("User is logging in")
}

export const logout = async (req,res) => {
    res.send("User is logged out")
}

export const check = async (req,res) => {
    res.send("You are a registered user")
}