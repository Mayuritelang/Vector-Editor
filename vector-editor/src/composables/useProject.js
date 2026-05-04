import { ref } from "vue"
import * as projectService from "../services/projectServices"

const projects = ref([])

export function useProjects() {

  // GET
  const fetchProjects = async () => {
    projects.value = await projectService.getProjects()
  }

  // CREATE
  const createProject = async (name) => {
    const newProject = await projectService.createProject(name)
    projects.value.push(newProject)
  }

  // DELETE
  const deleteProject = async (id) => {
    await projectService.deleteProject(id)
    projects.value = projects.value.filter(p => p._id !== id)
  }

  // UPDATE
  const updateProject = async (id, data) => {
    const updated = await projectService.updateProject(id, data)

    const index = projects.value.findIndex(p => p._id === id)
    if (index !== -1) {
      projects.value[index] = updated
    }
  }

  return {
    projects,
    fetchProjects,
    createProject,
    deleteProject,
    updateProject
  }
}