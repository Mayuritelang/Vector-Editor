import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import authRoutes from "./routes/authRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import { protect } from "./middleware/authMiddleware.js"

import http from "http"
import { Server } from "socket.io"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/projects", projectRoutes)

connectDB()

app.get("/", (req, res) => {
  res.send("API running")
})

app.get("/api/test", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user
  })
})

/* ================= SOCKET SETUP ================= */
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("join-project", (projectId) => {
    socket.join(projectId)
    console.log(`${socket.id} joined project ${projectId}`)
  })

  socket.on("cursor-move", ({ projectId, x, y }) => {
    socket.to(projectId).emit("cursor-move", {
      socketId: socket.id,
      x,
      y
    })
  })

  socket.on("canvas-update", ({ projectId, data }) => {
    console.log("CANVAS FROM:", socket.id)

    socket.to(projectId).emit("canvas-update", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

/* ================= START SERVER ================= */
server.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on ${process.env.PORT || 5000}`)
})