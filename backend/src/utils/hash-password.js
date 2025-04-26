import bcrypt from "bcryptjs"


export const hashThePassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}


export const isUserPasswordCorrect = async (hashedPassword, userPassword) =>{
    const isMatched = await bcrypt.compare(hashedPassword, userPassword)
    return isMatched
}