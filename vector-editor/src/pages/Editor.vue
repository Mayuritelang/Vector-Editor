<script setup>
import Toolbar from "../components/Canvas/Toolbar.vue"
import CanvasBoard from "../components/Canvas/Canvasboard.vue"
import { useRoute, useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import * as projectService from "../services/projectServices"
import { useSocket } from "../composables/useSocket"

const { socket, joinProject } = useSocket()
const route = useRoute()
const router = useRouter()
const projectName = ref("")

onMounted(async () => {
  const project = await projectService.getProjectById(route.params.id)
  projectName.value = project.name

  joinProject(route.params.id)
})

const goBack = () => {
  router.push("/dashboard")
}
</script>

<template>
  <div class="editor-layout">

    <!-- HEADER -->
    <div class="editor-header">
      <div class="left">
        <button @click="goBack">⬅</button>
        <h2>{{ projectName }}</h2>
      </div>

      <div class="right">
        <span class="status">● Auto Saving</span>
      </div>
    </div>

    <!-- TOOLBAR -->
    <Toolbar />

    <!-- WORKSPACE -->
    <div class="workspace">
      <CanvasBoard />
    </div>

  </div>
</template>

<style lang="scss">
.editor-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
}

/* HEADER */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 20px;
  background: #111827;
  color: white;

  .left {
    display: flex;
    align-items: center;
    gap: 12px;

    button {
      background: #1f2937;
      border: none;
      color: white;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        background: #374151;
      }
    }

    h2 {
      font-size: 16px;
      font-weight: 500;
      margin: 0;
    }
  }

  .status {
    font-size: 12px;
    color: #10b981;
  }
}

/* WORKSPACE */
.workspace {
  flex: 1;
  display: flex;
}
</style>