const db = require('../../config/db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        )
        if (rows.length === 0) {
            return res.status(401).json({
                message: "User not found"
            })
        }
        const user = rows[0]
        const match = await bcrypt.compare(
            password,
            user.password
        )
        if (!match) {
            return res.status(401).json({
                message: "Wrong password"
            })
        }
        const token = jwt.sign(
            {
                id: user.id,
                name: user.username,
                avatar: user.avatar,
                bio: user.bio,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.json({
            message: "Login success"
        })
    } catch (err) {
        next(err)
    }
}

// async function logout(req,res,next) {

// }



// async function register(req,res,next){

//     try{

//         const {username,password,email} = req.body

//         const hash = await bcrypt.hash(password,10)

//         await db.query(
//             "INSERT INTO users (username,email,password) VALUES (?,?,?)",
//             [username,email,hash]
//         )

//         res.json({
//             message:"User created"
//         })

//     }catch(err){
//         next(err)
//     }

// }

function me(req, res, next) {
    const user = req.user
    res.json(user)
}

function logout(req, res) {
    res.clearCookie("token")
    res.json({
        message: "Logout success"
    })
}
module.exports = {
    login,
    me,
    logout
}
