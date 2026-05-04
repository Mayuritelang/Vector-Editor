<template>
  <div class="toolbar">
    
    <!-- LEFT -->
    <div class="toolbar-left">
      <h1>Vector Editor</h1>
    </div>

    <!-- RIGHT -->
    <div class="toolbar-right">
      <button @click="addRect">Rect</button>
      <button @click="addCircle">Circle</button>
      <button @click="addTriangle">Triangle</button>
      <label class="svg-upload-btn">
  SVG
  <input
    type="file"
    accept=".svg"
    @change="handleSVGUpload"
    hidden
  />
</label>

      <button @click="toggleBrush">
        {{ isDrawingMode ? "Disable Brush" : "Brush" }}
      </button>

      <!-- BRUSH SIZE -->
      <input
        v-if="isDrawingMode"
        type="range"
        min="1"
        max="50"
        value="5"
        @input="handleBrushSize"
      />

      <button @click="undo">Undo</button>
      <button @click="redo">Redo</button>
      <button @click="rotateSelected">Rotate</button>
      <button @click="deleteSelected">Delete</button>
    </div>

  </div>
</template>

<script setup>
import { useCanvas } from "../../composables/useCanvas"

const {
  addRect,
  addCircle,
  addTriangle,
  deleteSelected,
  undo,
  redo,
  toggleBrush,
  changeBrushSize,
  isDrawingMode,
  rotateSelected,
  saveJSON,
loadJSON,
importSVG
} = useCanvas()

const handleBrushSize = (e) => {
  changeBrushSize(Number(e.target.value))
}

const handleSVGUpload = (e) => {
  importSVG(e)
}
</script>

<style scoped lang="scss">
.toolbar {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 30px;
}

/* LEFT */
.toolbar-left h1 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* RIGHT */
.toolbar-right {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.toolbar button {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar button:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-1px);
}

.toolbar button:active {
  transform: scale(0.96);
}

.toolbar input[type="range"] {
  width: 120px;
  cursor: pointer;
  accent-color: #2563eb;
}

/* Shape buttons */
.toolbar button:nth-child(1),
.toolbar button:nth-child(2),
.toolbar button:nth-child(3) {
  background: #dbeafe;
}

.toolbar button:nth-child(1):hover,
.toolbar button:nth-child(2):hover,
.toolbar button:nth-child(3):hover {
  background: #2563eb;
}

/* Delete button */
.toolbar button:last-child {
  background: #fee2e2;
  color: #dc2626;
}

.toolbar button:last-child:hover {
  background: #dc2626;
  color: white;
}

.svg-upload-btn {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fef3c7;
  cursor: pointer;
  transition: all 0.2s ease;
}

.svg-upload-btn:hover {
  background: #f59e0b;
  color: white;
}
</style>