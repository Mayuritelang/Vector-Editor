<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useProjects } from "../composables/useProject.js"

const router = useRouter()

const { projects, fetchProjects, createProject, deleteProject, updateProject } = useProjects()

const newProjectName = ref("")

onMounted(() => {
  fetchProjects()
})

const openProject = (id) => {
  router.push(`/editor/${id}`)
}

// CREATE
const handleCreate = async () => {
  if (!newProjectName.value.trim()) return

  await createProject(newProjectName.value)
  newProjectName.value = ""

  fetchProjects()
}

// DELETE
const handleDelete = async (id) => {
  await deleteProject(id)
  fetchProjects()
}

// RENAME
const handleRename = async (project) => {
  const newName = prompt("Enter new name", project.name)

  if (!newName) return

  await updateProject(project._id, { name: newName })
  fetchProjects()
}
</script>

<template>
  <div class="dashboard">

    <!-- HEADER -->
    <div class="header">

      <div>
        <p class="sub-title">Workspace</p>
        <h2>My Projects</h2>
      </div>

      <div class="create-box">
        <input
          v-model="newProjectName"
          placeholder="New project name"
          @keyup.enter="handleCreate"
        />

        <button @click="handleCreate">
          + Create Project
        </button>
      </div>

    </div>

    <!-- EMPTY -->
    <div v-if="projects.length === 0" class="empty">
      <p>No projects yet 🚀</p>
    </div>

    <!-- TABLE -->
    <div v-else class="table-wrapper">

      <table class="projects-table">

        <thead>
          <tr>
            <th>S.no</th>
            <th>Project Name</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="(p, index) in projects"
            :key="p._id"
          >

            <td>{{ index + 1 }}</td>

            <td>
              <div class="project-info">
                <div class="project-icon">
                  🎨
                </div>

                <span>{{ p.name }}</span>
              </div>
            </td>

            <td>
              <span class="status active">
                Active
              </span>
            </td>

            <td>
              {{
                p.createdAt
                  ? new Date(p.createdAt).toLocaleDateString()
                  : "—"
              }}
            </td>

            <td>
              <div class="actions">

                <button
                  class="open"
                  @click="openProject(p._id)"
                >
                  Open
                </button>

                <button
                  class="rename"
                  @click="handleRename(p)"
                >
                  Rename
                </button>

                <button
                  class="delete"
                  @click="handleDelete(p._id)"
                >
                  Delete
                </button>

              </div>
            </td>

          </tr>

        </tbody>

      </table>

    </div>

  </div>
</template>

<style lang="scss">
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  background: #f4f7fb;
  font-family: "Inter", sans-serif;
}

/* HEADER */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 20px;
  flex-wrap: wrap;

  h2 {
    font-size: 2rem;
    color: #111827;
    margin-top: 4px;
  }

  .sub-title {
    color: #43cea2;
    font-weight: 600;
    font-size: 0.95rem;
  }
}

/* CREATE */

.create-box {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;

  input {
    width: 250px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #d1d5db;
    outline: none;
    background: white;

    &:focus {
      border-color: #43cea2;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
    }
  }

  button {
    border: none;
    background: #43cea2;
    color: white;
    padding: 12px 18px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #43cea2, #185a9d); ;
    }
  }
}

/* EMPTY */

.empty {
  text-align: center;
  margin-top: 5rem;
  color: #6b7280;
  font-size: 1rem;
}

/* TABLE */

.table-wrapper {
  background: white;
  border-radius: 20px;
  overflow-x: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;

  thead {
    background: #222;

    th {
      text-align: left;
      padding: 18px;
      font-size: 0.92rem;
      color: #fff;
      font-weight: 600;
    }
  }

  tbody {

    tr {
      border-top: 1px solid #f1f5f9;
      transition: 0.2s ease;

      &:hover {
        background: #f9fafb;
      }
    }

    td {
      padding: 18px;
      color: #374151;
      font-size: 1rem;
    }
  }
}

/* PROJECT INFO */

.project-info {
  display: flex;
  align-items: center;
  gap: 12px;

  span {
    font-weight: 600;
    color: #111827;
  }
}

.project-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #43cea2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
}

/* STATUS */

.status {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
}

.active {
  background: #dcfce7;
  color: #15803d;
}

/* ACTIONS */

.actions {
  display: flex;
  gap: 10px;

  button {
    border: none;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s ease;
  }

  .open {
    background: #22c55e;
    color: white;

    &:hover {
      background: #16a34a;
    }
  }

  .rename {
    background: #f59e0b;
    color: white;

    &:hover {
      background: #d97706;
    }
  }

  .delete {
    background: #ef4444;
    color: white;

    &:hover {
      background: #dc2626;
    }
  }
}

/* MOBILE */

@media (max-width: 768px) {

  .dashboard {
    padding: 1rem;
  }

  .header {
    align-items: flex-start;
  }

  .create-box {
    width: 100%;

    input {
      width: 100%;
    }

    button {
      width: 100%;
    }
  }

  .actions {
    flex-direction: column;
  }
}
</style>