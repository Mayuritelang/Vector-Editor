<template>
  <div class="canvas-page">
  <div class="canvas-wrapper">
    <div
      v-for="(cursor, id) in cursors"
      :key="id"
      class="cursor"
      :style="{
        left: cursor.x + 'px',
        top: cursor.y + 'px'
      }"
    ></div>

    <canvas ref="canvasRef"></canvas>

  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useCanvas } from "../../composables/useCanvas.js"
import { useSocket } from "../../composables/useSocket"
import { useRoute } from "vue-router"

const route = useRoute()
const { onCursorMove, joinProject } = useSocket()
const cursors = ref({})
const canvasRef = ref(null)

const { initCanvas } = useCanvas()

onMounted(async (data) => {

  joinProject(route.params.id)
    await initCanvas(canvasRef.value)

onCursorMove(({ socketId, x, y }) => {
  cursors.value[socketId] = { x, y }
})
})
</script>

<style scoped lang="scss">
.canvas-page {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background: #f3f4f6;
  box-sizing: border-box;
}

/* canvas outer box */
.canvas-wrapper {
  position: relative;
  padding: 14px;
  background: white;
  border-radius: 18px;
  border: 1px solid #d1d5db;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 4px 10px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

/* hover effect */
.canvas-wrapper:hover {
  transform: translateY(-2px);
  box-shadow:
    0 18px 35px rgba(0, 0, 0, 0.12),
    0 8px 18px rgba(0, 0, 0, 0.08);
}

/* actual fabric canvas */
.canvas-wrapper canvas {
  display: block;
  border-radius: 12px;
  background: white;
}

.cursor {
  position: absolute;
  width: 10px;
  height: 10px;
  background: gold;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
}
</style>