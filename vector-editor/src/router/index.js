import { createRouter, createWebHistory } from "vue-router"
import Login from "../pages/Login.vue"
import Signup from "../pages/Signup.vue"
import Dashboard from "../pages/Dashboard.vue"
import Editor from "../pages/Editor.vue"

const routes = [
  { path: "/", component: Login },
  { path: "/signup", component: Signup },
  { path: "/dashboard", component: Dashboard },
  { path: "/editor/:id", component: Editor } 
]

export default createRouter({
  history: createWebHistory(),
  routes
})