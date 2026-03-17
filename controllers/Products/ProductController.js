const db = require("../../config/db")
const cloudinary = require("../../config/cloudinary")
const fs = require("fs")

async function getProjects(req, res, next) {
    try {
        const [rows] = await db.query("SELECT * FROM projects")
        res.json(rows)
    } catch (err) {
        next(err)
    }
}

async function createProject(req, res, next) {
    try {

        const { title, description, link_project, url_video } = req.body

        if (!title) {
            return res.status(400).json({ message: "Title required" })
        }

        let thumbnail = null

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "projects/thumbnail"
            })

            thumbnail = result.secure_url
            // Clean up the local file after uploading to Cloudinary
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        console.log("FILE:", req.file)
        await db.query(
            "INSERT INTO projects (title,description,thumbnail,link_project,url_video) VALUES (?,?,?,?,?)",
            [title, description, thumbnail, link_project, url_video]
        )

        res.json({
            message: "Created Successfully Projects",
            thumbnail
        })

    } catch (err) {
        next(err)
    }
}

async function updateProject(req, res, next) {
    try {

        const { id } = req.params
        const { title, description, link_project, url_video } = req.body

        const [rows] = await db.query(
            "SELECT thumbnail FROM projects WHERE id=?",
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Project not found" })
        }

        let thumbnail = rows[0].thumbnail

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "projects/thumbnail"
            })

            thumbnail = result.secure_url
            // Clean up the local file after uploading to Cloudinary
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }
        }

        await db.query(
            "UPDATE projects SET title=?, description=?, thumbnail=?, link_project=?, url_video=? WHERE id=?",
            [title, description, thumbnail, link_project, url_video, id]
        )

        res.json({
            message: "Project updated successfully"
        })

    } catch (err) {
        next(err)
    }
}

async function deleteProject(req, res, next) {
    try {

        const { id } = req.params

        const [rows] = await db.query(
            "SELECT thumbnail FROM projects WHERE id=?",
            [id]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Project not found" })
        }

        await db.query(
            "DELETE FROM projects WHERE id=?",
            [id]
        )

        res.json({
            message: "Project deleted successfully"
        })

    } catch (err) {
        next(err)
    }
}

module.exports = {
    getProjects,
    createProject,
    updateProject,
    deleteProject
}
