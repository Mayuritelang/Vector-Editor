<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "../composables/useAuth"

const email = ref("")
const password = ref("")
const loading = ref(false)

const { loginUser } = useAuth()
const router = useRouter()

const login = async () => {
  try {
    loading.value = true

    await loginUser({
      email: email.value,
      password: password.value
    })

    router.push("/dashboard")
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="top-section">
        <h2>Welcome Back 👋</h2>
        <p>Login to continue your account</p>
      </div>

      <form @submit.prevent="login">
      <div class="input-box">
  <label>Email Address</label>
  <input
    v-model="email"
    type="email"
    placeholder="Enter your email"
    required
  />
</div>

<div class="input-box">
  <label>Password</label>
  <input
    v-model="password"
    type="password"
    placeholder="Enter your password"
    required
  />
</div>

        <button class="login-btn" type="submit">
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>

      <p class="redirect">
        Don’t have an account?
        <router-link to="/signup">Signup</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #43cea2, #185a9d);
  font-family: "Inter", sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  padding: 40px 32px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.top-section {
  text-align: center;
  margin-bottom: 35px;

  h2 {
    font-size: 30px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #6b7280;
  }
}

.input-box {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  label {
    margin-bottom: 6px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
  }

  input {
    width: 100%;
    height: 48px;
    padding: 0 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 10px;
    background: #f9fafb;
    font-size: 14px;
    transition: all 0.25s ease;

    &:focus {
      outline: none;
      border-color: #43cea2;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(67, 206, 162, 0.15);
    }
  }
}

.login-btn {
  width: 100%;
  height: 54px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #43cea2, #185a9d);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(24, 90, 157, 0.25);
  }

  &:active {
    transform: scale(0.98);
  }
}

.redirect {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;

  a {
    color: #185a9d;
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 480px) {
  .auth-card {
    padding: 30px 22px;
    border-radius: 18px;
  }

  .top-section {
    h2 {
      font-size: 24px;
    }
  }

  .input-box input {
    height: 54px;
  }
}
</style>