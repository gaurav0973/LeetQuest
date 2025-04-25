


export const register = async(req,res) => {
    res.send("User is Registering")
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