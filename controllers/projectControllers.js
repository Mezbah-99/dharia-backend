const fs = require('fs');
const Project = require('../models/projectModels')
const mongoose = require('mongoose')



let banner = ""
let updateBanner = ""

// Phostos Controller 
const photosController = (req, res) => {
    banner = `photos/${req.file.filename}`
}



const updateController = (req, res) => {
    updateBanner = `photos/${req.file.filename}`
}



// get all projects
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({}).sort({ createdAt: -1 })
        res.status(200).json(projects)
    } catch (error) {
        res.status(404).json(error)
    }
}

// get single project
const getSingleProject = async (req, res) => {


    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid id!" })
    }
    const project = await Project.findById(id);
    if (!project) {
        return res.status(404).json({ error: "Something went Wrorng!" })
    }
    res.status(200).json(project)
}
// Create new projects
const postNewProject = async (req, res) => {
    //console.log(req.body)
    const { title, price, profile, name, userid } = req.body;

    try {
        const project = await Project.create({
            //...req.body
            title,
            price, profile, name, userid, banner
        })
        res.status(200).json(project)
        if (project) {
            banner = ""
        }
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
}
// Delete single projects
const deleteProject = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid id!" })
    }
    const project = await Project.findOneAndDelete({ _id: id })
    if (!project) {
        res.status(400).json({ error: "No project Found!" })
    }

    // Deleting project
    if (project.banner) {
        const orgPath = project.banner.split("photos")[1]
        const path = `uploads${orgPath}`
        try {
            fs.unlinkSync(path)
            //file removed
        } catch (err) {
            console.error(err)
        }
    }

    res.status(200).json({ project, message: "Deleted this projects." })

}

// patch single projects
const patchProject = async (req, res) => {
    const {
        banner,
        title,
        price,
        name,
        userid } = req.body;

    const frontUrl = banner.split('photos')[1]
    const orgUrl = `uploads${frontUrl}`


    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid id!" })
    }

    const project = await Project.findOneAndUpdate(
        { _id: id },
        { title, price, name, userid, banner: updateBanner },
        { new: true }
    )
    if (!project) {
        res.status(400).json({ error: "No project Found!" })
    }
    if (project) {
        try {
            fs.unlinkSync(orgUrl)
            //file removed
        } catch (err) {
            console.error(err)
        }
    }
    res.status(200).json({ project, message: "updated this projects!" })
}

module.exports = { getAllProjects, getSingleProject, postNewProject, deleteProject, patchProject, photosController, updateController }