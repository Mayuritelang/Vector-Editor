import { ref } from "vue"
import * as authService from "../services/authServices"

const user = ref(null)

export function useAuth() {

  const signupUser = async (data) => {
    user.value = await authService.signup(data)
  }

  const loginUser = async (data) => {
    user.value = await authService.login(data)
  }

  const logout = () => {
    localStorage.removeItem("token")
    user.value = null
  }

  return {
    user,
    signupUser,
    loginUser,
    logout
  }
}