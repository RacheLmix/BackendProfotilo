require("dotenv").config()
const cookieParser = require("cookie-parser")
const express = require("express")
const cors = require("cors")
const authRoutes = require("./routes/authRoutes")
const projectRouter = require("./routes/projectRoutes")
const errorMiddleware = require("./middleware/errorMiddleware")
//Created app
const app = express()
//use app
app.use(cookieParser())
app.use(cors({
    origin: "https://rachelapps.netlify.app",
    credentials: true
}))

app.use(express.json())

//Router
app.get("/",(req,res)=>{
    res.json({message:"API Profotilo is running"})
})

app.use("/api/projects",projectRouter)
app.use("/api/auth",authRoutes)
app.use(errorMiddleware)


//PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>{
    console.log("Server running on port " + PORT)
})
