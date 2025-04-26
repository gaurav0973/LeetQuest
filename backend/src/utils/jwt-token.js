import jwt from "jsonwebtoken"


export const generateJWTToken = (newUser) => {
    return jwt.sign(
        {id : newUser.id},
        process.env.JWT_SECRET,
        {expiresIn : process.env.JWT_EXPIRATION}
    )
}