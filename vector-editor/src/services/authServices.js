import API from "./api"

export const signup = async (data) => {
  const res = await API.post("/auth/signup", data)
  localStorage.setItem("token", res.data.token)
  return res.data
}

export const login = async (data) => {
  const res = await API.post("/auth/login", data)
  localStorage.setItem("token", res.data.token)
  return res.data
}