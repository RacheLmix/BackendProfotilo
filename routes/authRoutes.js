const express = require("express")
const router = express.Router()

const authController = require("../controllers/Auth/AuthController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/admin/login",authController.login)
// router.post("/created", authController.register)
router.get("/admin/me",authMiddleware,authController.me)
router.post("/admin/logout", authController.logout)
module.exports = router
