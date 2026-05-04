<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAuth } from "../composables/useAuth"

const name = ref("")
const email = ref("")
const password = ref("")
const { signupUser } = useAuth()
const router = useRouter()

const signup = async () => {
  await signupUser({
    name: name.value,
    email: email.value,
    password: password.value
  })
  router.push("/dashboard")
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2 class="title">Create Account</h2>

      <div class="form-group">
        <input v-model="name" type="text" required />
        <label>Full Name</label>
      </div>

      <div class="form-group">
        <input v-model="email" type="email" required />
        <label>Email</label>
      </div>

      <div class="form-group">
        <input v-model="password" type="password" required />
        <label>Password</label>
      </div>

      <button class="signup-btn" @click="signup">
        Signup
      </button>

      <p class="redirect">
        Already have an account?
        <router-link to="/">Login</router-link>
      </p>
    </div>
  </div>
</template>

<style lang="scss">
.auth-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #43cea2, #185a9d); 
  font-family: "Inter", sans-serif;
}

.auth-card {
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  .title {
    text-align: center;
    margin-bottom: 1.5rem;
    font-size: 1.6rem;
    font-weight: 600;
    color: #333;
  }
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;

  input {
    width: 100%;
    padding: 12px 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    font-size: 14px;
    transition: 0.2s ease;

    &:focus {
      border-color: #43cea2;
    }

    &:focus + label,
    &:valid + label {
      top: -8px;
      left: 8px;
      font-size: 12px;
      background: #fff;
      padding: 0 4px;
      color: #43cea2;
    }
  }

  label {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #999;
    font-size: 14px;
    pointer-events: none;
    transition: 0.2s ease;
  }
}

.signup-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #43cea2;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #38b893;
  }

  &:active {
    transform: scale(0.98);
  }
}

.redirect {
  margin-top: 1rem;
  text-align: center;
  font-size: 14px;

  a {
    color: #43cea2;
    font-weight: 500;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>