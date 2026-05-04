import { io } from "socket.io-client"

const socket = io("http://localhost:5000")

export function useSocket() {

  const joinProject = (projectId) => {
    socket.emit("join-project", projectId)
  }

  const sendCanvas = (projectId, data) => {
    socket.emit("canvas-update", { projectId, data })
  }

  const onCanvasUpdate = (cb) => {
    socket.on("canvas-update", cb)
  }

  const sendCursor = (projectId, x, y) => {
    socket.emit("cursor-move", { projectId, x, y })
  }

  const onCursorMove = (cb) => {
    socket.on("cursor-move", cb)
  }

  socket.on("connect", () => {
    console.log("Connected:", socket.id)
  })

  return {
    socket,
    joinProject,
    sendCanvas,
    onCanvasUpdate,
    sendCursor,
    onCursorMove
  }
}