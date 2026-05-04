import API from "./api"

// GET ALL
export const getProjects = async () => {
  const res = await API.get("/projects")
  return res.data
}

// CREATE
export const createProject = async (name) => {
  const res = await API.post("/projects", { name })
  return res.data
}

// GET BY ID
export const getProjectById = async (id) => {
  const res = await API.get(`/projects/${id}`)
  return res.data
}

// UPDATE
export const updateProject = async (id, data) => {
  const res = await API.put(`/projects/${id}`, data)
  return res.data
}

// DELETE 
export const deleteProject = async (id) => {
  const res = await API.delete(`/projects/${id}`)
  return res.data
}