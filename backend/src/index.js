import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.routes.js"


dotenv.config()

const app = express()

app.use(express.json());
app.use(cookieParser());


app.get("/" , (req , res)=>{
    res.send("Hello developers welcome to leetQuest🔥");
})

// routes
app.use("/api/v1/auth" , authRoute);

app.listen(process.env.PORT, ()=> {
    console.log("Server is running at PORT : ", process.env.PORT)
})
