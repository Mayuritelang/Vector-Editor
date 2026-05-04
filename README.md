Vector Editor (MEVN + Fabric.js)

A full-stack web-based 2D Vector Shape Editor built using the MEVN stack with real-time collaboration capabilities. This application allows users to create, edit, and manage vector-based designs directly on a canvas.

 Features
 Authentication
User signup & login
JWT-based authentication
Protected routes

Project Management (CRUD)
Create new projects
Load existing projects
Update and save canvas state
Delete projects

Canvas Editor (Fabric.js)
Add shapes (Rectangle, Circle, Triangle)
Move, resize, rotate objects
Free drawing mode (brush)
Object selection & manipulation

State Management
Undo / Redo functionality
Canvas history tracking

Real-Time Collaboration
WebSocket-based live updates
Multiple users can edit simultaneously
Instant sync across clients

Auto Save
Automatic project saving after changes
Prevents data loss

Tech Stack

1. Frontend
Vue 3 (Composition API)
Vue Router
SCSS
Fabric.js

2. Backend
Node.js
Express.js
Database
MongoDB
Real-Time
WebSockets (Socket.io)
Authentication
JWT (JSON Web Tokens)

Project Structure
/vector-editor
  /components
  /utils
  /pages
  /router
  /composables
  /services

/Backend
  /controllers
  /config
  /middleware
  /models
  /routes
  /sockets
 
Installation & Setup

1. Clone the repository
git clone https://github.com/your-username/vector-editor.git
cd vector-editor
2. Install dependencies
vector-editor
cd vector-editor
npm install
npm run dev
Backend
cd Backend
npm install
npm run dev

Environment Variables

Create a .env file in the server folder:
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Usage
Register / Login
Create a new project
Start designing on canvas
Changes auto-save
Collaborate in real-time

Key Concepts Implemented
Canvas rendering & object manipulation using Fabric.js
State history management (Undo/Redo)
Real-time sync using WebSockets
RESTful API design
Authentication & authorization