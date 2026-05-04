import { ref, shallowRef } from "vue"
import * as fabric from "fabric"
import { createHistory } from "../utils/history"
import * as projectService from "../services/projectServices"
import { useRoute } from "vue-router"
import { useSocket } from "./useSocket"

const { sendCursor, sendCanvas, onCanvasUpdate } = useSocket()

const canvas = shallowRef(null)
const isDrawingMode = ref(false)

const history = createHistory()

let isRestoring = false
let hasLoaded = false
let saveTimeout = null

export function useCanvas() {

  const route = useRoute()
  const projectId = route.params.id

  // ---------------- RANDOM POSITION ----------------
  const randomPos = () => ({
    left: Math.random() * 500,
    top: Math.random() * 300
  })

  // ---------------- GET STATE ----------------
  const getState = () => {
    return JSON.stringify(canvas.value.toJSON())
  }

  // ---------------- SET STATE ----------------
  const setState = async (state) => {

    if (!canvas.value) return

    isRestoring = true

    try {

      const parsed =
        typeof state === "string"
          ? JSON.parse(state)
          : state

      await canvas.value.loadFromJSON(parsed)

      canvas.value.renderAll()
      canvas.value.requestRenderAll()
      canvas.value.calcOffset()

    } catch (err) {
      console.error("setState error:", err)
    }

    isRestoring = false
  }

  // ---------------- SAVE TO DB ----------------
  const debounceSaveToDB = () => {

    clearTimeout(saveTimeout)

    saveTimeout = setTimeout(async () => {

      try {
        const json = canvas.value.toJSON()

        await projectService.updateProject(projectId, {
          canvasData: json
        })

      } catch (err) {
        console.error("DB Save failed:", err)
      }

    }, 800)
  }

  // ---------------- PERSIST STATE ----------------
  const persistState = () => {

    if (!canvas.value) return

    const state = getState()

    sendCanvas(projectId, state)

    debounceSaveToDB()
  }

  // ---------------- SAVE ----------------
  const save = () => {

    if (!canvas.value) return

    if (isRestoring) return

    if (!hasLoaded) return

    const state = getState()

    history.push(state)

    sendCanvas(projectId, state)

    debounceSaveToDB()
  }

  // ---------------- UNDO ----------------
  const undo = async () => {

    const prev = history.undo()

    if (!prev) return

    await setState(prev)

    persistState()
  }

  // ---------------- REDO ----------------
  const redo = async () => {

    const next = history.redo()

    if (!next) return

    await setState(next)

    persistState()
  }

  // ---------------- KEYBOARD SHORTCUTS ----------------
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

  // ---------------- LOAD FROM DB ----------------
  const loadCanvasFromDB = async () => {

    try {

      if (!canvas.value) return

      isRestoring = true

      const project =
        await projectService.getProjectById(projectId)

      if (project?.canvasData) {

        const data =
          typeof project.canvasData === "string"
            ? JSON.parse(project.canvasData)
            : project.canvasData

        await canvas.value.loadFromJSON(data)

        canvas.value.renderAll()
        canvas.value.requestRenderAll()
        canvas.value.calcOffset()
      }

      canvas.value.forEachObject((obj) => {

        obj.set({
          selectable: true,
          evented: true,
          hasControls: true,
          hasBorders: true,
          lockScalingX: false,
          lockScalingY: false,
          lockRotation: false,
        })

        // IMPORTANT
        obj.setControlsVisibility({
          mt: true,
          mb: true,
          ml: true,
          mr: true,
          tl: true,
          tr: true,
          bl: true,
          br: true,
          mtr: true,
        })

        obj.setCoords()
      })

    } catch (err) {
      console.error("Load failed:", err)
    }

    isRestoring = false
  }

  // ---------------- INIT CANVAS ----------------
  const initCanvas = async (el) => {

    try {

      canvas.value = new fabric.Canvas(el, {
        width: 900,
        height: 600,
        backgroundColor: "#fff",
        selection: true
      })

      fabric.Object.prototype.set({
        transparentCorners: false,
        cornerColor: "blue",
        cornerStyle: "circle",
        cornerSize: 12,
        borderColor: "blue",
        hasControls: true,
        hasBorders: true,
        selectable: true,
      })

      document.addEventListener(
        "keydown",
        handleShortcuts
      )

      await loadCanvasFromDB()

      hasLoaded = true

      history.init(getState())

      // OBJECT ADDED
      canvas.value.on("object:added", () => {

        if (isRestoring) return

        save()
      })

      // OBJECT REMOVED
      canvas.value.on("object:removed", () => {

        if (isRestoring) return

        save()
      })

      // AFTER MOVE / ROTATE / SCALE COMPLETE
      canvas.value.on("object:modified", () => {

        if (isRestoring) return

        save()
      })

      canvas.value.on("mouse:up", () => {

        if (isRestoring) return

        const activeObject =
          canvas.value.getActiveObject()

        if (!activeObject) return

        save()
      })

      // CURSOR
      canvas.value.on("mouse:move", (opt) => {

        if (!opt.e) return

        const rect =
          canvas.value.upperCanvasEl.getBoundingClientRect()

        const x = opt.e.clientX - rect.left
        const y = opt.e.clientY - rect.top

        sendCursor(projectId, x, y)
      })

      // SOCKET UPDATE
      onCanvasUpdate(async (data) => {

        if (!hasLoaded) return
        if (isRestoring) return

        const active = canvas.value.getActiveObject()
        if (active) return

        await setState(data)
      })

    } catch (err) {
      console.error("initCanvas crashed:", err)
    }
  }

  // ---------------- EXPORT JSON ----------------
  const saveJSON = () => {

    const data = JSON.stringify(
      canvas.value.toJSON()
    )

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

  // ---------------- IMPORT JSON ----------------
  const loadJSON = (event) => {

    const file = event.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = async (e) => {

      const json = JSON.parse(e.target.result)

      await setState(json)

      history.init(getState())

      persistState()
    }

    reader.readAsText(file)

  }

  const importSVG = async (event) => {

    const file = event.target.files[0]

    if (!file) return

    const reader = new FileReader()

    reader.onload = async (e) => {

      try {

        const svgText = e.target.result

        const result =
          await fabric.loadSVGFromString(svgText)

        const objects = result.objects
        const options = result.options

        const svgGroup =
          fabric.util.groupSVGElements(
            objects,
            options
          )

        svgGroup.set({
          left: 200,
          top: 150,
          scaleX: 1,
          scaleY: 1,
          hasControls: true,
          centeredRotation: true
        })

        canvas.value.add(svgGroup)

        canvas.value.setActiveObject(svgGroup)

        canvas.value.renderAll()

      } catch (err) {
        console.error("SVG Import Error:", err)
      }
    }

    reader.readAsText(file)

    // reset input
    event.target.value = ""
  }

  // ---------------- SHAPES ----------------
  const addRect = () => {

    canvas.value.add(
      new fabric.Rect({
        width: 100,
        height: 100,
        fill: "blue",
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        ...randomPos()
      })

    )
  }

  const addCircle = () => {

    canvas.value.add(
      new fabric.Circle({
        radius: 50,
        fill: "green",
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        ...randomPos()
      })
    )
  }

  const addTriangle = () => {

    canvas.value.add(
      new fabric.Triangle({
        width: 100,
        height: 100,
        fill: "red",
        selectable: true,
        evented: true,
        hasControls: true,
        hasBorders: true,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        ...randomPos()
      })
    )
  }

  // ---------------- DELETE ----------------
  const deleteSelected = () => {

    const obj = canvas.value.getActiveObject()

    if (!obj) return

    canvas.value.remove(obj)
  }

  // ---------------- BRUSH ----------------
  const toggleBrush = () => {

    isDrawingMode.value =
      !isDrawingMode.value

    canvas.value.isDrawingMode =
      isDrawingMode.value

    if (isDrawingMode.value) {

      const brush =
        new fabric.PencilBrush(canvas.value)

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


  // ---------------- RETURN ----------------
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
    saveJSON,
    loadJSON,
    importSVG,
  }
}