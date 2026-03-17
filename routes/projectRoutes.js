const express = require("express")
const multer = require("multer")
const router = express.Router()
console.log("projectRoutes loaded")
const authMiddleware = require("../middleware/authMiddleware")
const projectController = require("../controllers/Products/ProductController")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })


router.get("/", projectController.getProjects)
router.post("/product", authMiddleware, upload.single("thumbnail"), projectController.createProject)
router.put("/product/:id", authMiddleware, upload.single("thumbnail"), projectController.updateProject)
router.delete("/product/:id", authMiddleware, projectController.deleteProject)
module.exports = router