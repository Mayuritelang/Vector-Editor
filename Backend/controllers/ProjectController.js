import Project from "../models/Project.js"

//CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name || "Untitled",
      user: req.user._id
    })

    res.status(201).json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET ALL PROJECTS (user specific)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
    res.json(projects)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    res.json(project)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//UPDATE PROJECT (canvas save)
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    project.canvasData = req.body.canvasData || project.canvasData
    project.name = req.body.name || project.name

    const updated = await project.save()

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ message: "Project not found" })
    }

    await project.deleteOne()

    res.json({ message: "Project deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}