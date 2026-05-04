import { ref } from "vue"
import * as fabric from "fabric"
import { createHistory } from "../utils/history"
import * as projectService from '../services/projectServices'
import { useRoute } from "vue-router"
import { onUnmounted } from "vue"
import { useSocket } from "./useSocket"

const { sendCursor, sendCanvas, onCanvasUpdate } = useSocket()
const canvas = ref(null)
const isDrawingMode = ref(false)
let isRestoring = false
const history = createHistory()
let saveTimeout = null

export function useCanvas() {
  const route = useRoute()
  const projectId = route.params.id
  const randomPos = () => ({
    left: Math.random() * 500,
    top: Math.random() * 300
  })
  let lastSent = 0

  const getState = () => JSON.stringify(canvas.value.toJSON())

  const setState = (state) => {
    isRestoring = true

    const parsed =
      typeof state === "string" ? JSON.parse(state) : state

    canvas.value.loadFromJSON(parsed, () => {
      canvas.value.renderAll()
      canvas.value.requestRenderAll()
      canvas.value.calcOffset()

      setTimeout(() => {
        isRestoring = false
      }, 0)
    })
  }

  // ---------------- UNDO / REDO ----------------
  const undo = () => {
    const prev = history.undo()
    if (!prev) return

    setState(prev)
  }

  const redo = () => {
    const next = history.redo()
    if (!next) return

    setState(next)
  }

  const handleShortcuts = (e) => {
    const key = e.key.toLowerCase()

    // Undo
    if ((e.ctrlKey || e.metaKey) && key === "z") {
      e.preventDefault()
      undo()
    }

    // Redo
    if (
      ((e.ctrlKey || e.metaKey) && key === "y") ||
      ((e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        key === "z")
    ) {
      e.preventDefault()
      redo()
    }
  }

  const initCanvas = async (el) => {
    try {

      canvas.value = new fabric.Canvas(el, {
        width: 900,
        height: 600,
        backgroundColor: "#fff"
      })

      document.addEventListener("keydown", handleShortcuts)

      await loadCanvasFromDB()

      history.init(getState())

      canvas.value.on("object:added", save)
      canvas.value.on("object:modified", save)
      canvas.value.on("object:removed", save)

      canvas.value.on("mouse:move", (opt) => {
        if (!opt.e) return

        const rect = canvas.value.upperCanvasEl.getBoundingClientRect()

        const x = opt.e.clientX - rect.left
        const y = opt.e.clientY - rect.top

        sendCursor(projectId, x, y)
      })

      onCanvasUpdate((data) => {
        setState(data)
      })

    } catch (err) {
      console.error("initCanvas crashed:", err)
    }
  }

  const saveJSON = () => {
    const data = JSON.stringify(canvas.value.toJSON())

    const blob = new Blob([data], {
      type: "application/json"
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")

    a.href = url
    a.download = "canvas.json"
    a.click()

    URL.revokeObjectURL(url)
  }

  const loadJSON = (event) => {
    const file = event.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = (e) => {
      const json = JSON.parse(e.target.result)

      canvas.value.clear()

      canvas.value.loadFromJSON(json, () => {
        canvas.value.backgroundColor = "#fff"

        canvas.value.renderAll()
        canvas.value.requestRenderAll()

        history.init(getState())
      })
    }

    reader.readAsText(file)
  }

  const testSend = () => {
  const state = getState()
  sendCanvas(projectId, state)
}

  const save = () => {

    if (isRestoring) return

    const state = getState()
    history.push(state)

    sendCanvas(projectId, state)

    debounceSaveToDB()
  }

  const debounceSaveToDB = () => {
    clearTimeout(saveTimeout)

    saveTimeout = setTimeout(async () => {
      try {

        const json = canvas.value.toJSON()

        await projectService.updateProject(projectId, {
          canvasData: json
        })

      } catch (err) {
        console.error("DB Save failed", err)
      }
    }, 800)
  }

  const loadCanvasFromDB = async () => {
    try {

      isRestoring = true

      const project = await projectService.getProjectById(projectId)


      if (project?.canvasData) {

        await new Promise((resolve) => {
          const data =
            typeof project.canvasData === "string"
              ? JSON.parse(project.canvasData)
              : project.canvasData

          canvas.value.loadFromJSON(data, () => {
            canvas.value.renderAll()
            canvas.value.requestRenderAll()

            setTimeout(() => {
              canvas.value.calcOffset()
              canvas.value.requestRenderAll()
            }, 0)

            resolve()
          })
        })
      }

      isRestoring = false

    } catch (err) {
      console.error("Load failed FULL:", err)
    }
  }
  // ---------------- SHAPES ----------------

  const addRect = () => {
    canvas.value.add(new fabric.Rect({
      width: 100,
      height: 100,
      fill: "blue",
      hasControls: true,
      centeredRotation: true,
      ...randomPos()
    }))
    save()
  }

  const addCircle = () => {
    canvas.value.add(new fabric.Circle({
      radius: 50,
      fill: "green",
      hasControls: true,
      centeredRotation: true,
      ...randomPos()
    }))
    save()
  }

  const addTriangle = () => {
    canvas.value.add(new fabric.Triangle({
      width: 100,
      height: 100,
      fill: "red",
      hasControls: true,
      centeredRotation: true,
      ...randomPos()
    }))
    save()
  }

  // ---------------- DELETE ----------------

  const deleteSelected = () => {
    const obj = canvas.value.getActiveObject()
    if (obj) {
      canvas.value.remove(obj)
      save()
    }
  }

  // ---------------- BRUSH ----------------

  const toggleBrush = () => {
    isDrawingMode.value = !isDrawingMode.value
    canvas.value.isDrawingMode = isDrawingMode.value

    if (isDrawingMode.value) {
      const brush = new fabric.PencilBrush(canvas.value)

      brush.width = 5
      brush.color = "black"

      canvas.value.freeDrawingBrush = brush
    }
  }

  const changeBrushSize = (size) => {
    if (canvas.value.freeDrawingBrush) {
      canvas.value.freeDrawingBrush.width = size
    }
  }

  const rotateSelected = () => {
    const obj = canvas.value.getActiveObject()

    if (!obj) return

    obj.rotate((obj.angle || 0) + 15)

    canvas.value.renderAll()

    save()
  }


  return {
    canvas,
    initCanvas,
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
    loadJSON
  }
}