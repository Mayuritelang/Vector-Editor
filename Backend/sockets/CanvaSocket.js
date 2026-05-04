export default function setupCanvasSocket(io) {
  io.on("connection", (socket) => {
    console.log("Connected:", socket.id)

    socket.on("join-project", (projectId) => {
      socket.join(projectId)
      console.log(`User joined project: ${projectId}`)
    })

    socket.on("canvas-update", ({ projectId, data }) => {
      socket.to(projectId).emit("canvas-update", data)
    })

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id)
    })
  })
}