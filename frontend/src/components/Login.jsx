import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import axiosInstance from '../utils/axiosInstance';
import { validateEmail } from '../utils/helper';
import { authStyles as styles } from "../assets/dummystyle"
import { Input } from "./Input"

import { UserContext } from "../context/userContext"
import { API_PATHS } from "../utils/apiPaths";


const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email")
      return
    }
    if (!password) {
      setError("Please enter a password")
      return
    }

    setError("")
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password })

      // Backend currently returns token + user fields at top level
      const { token, _id, name, email: userEmail } = response.data

      if (token && _id) {
        localStorage.setItem("token", token)
        updateUser({
          token,
          user: {
            _id,
            name,
            email: userEmail,
          },
        })
        navigate("/dashboard")
      } else {
        setError("Invalid response: missing token or user")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong : please try again")
      console.error("Login error:", err.response?.data || err.message)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
          Sign in to continue building your amazing resume
        </p>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="johndoe@example.com"
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Minimum 8 characters"
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button className={styles.submitButton} type="submit">
          Sign In
        </button>

        <p className={styles.switchText}>
          Don&apos;t have an account?{" "}
          <button
            onClick={() => setCurrentPage("signup")}
            type="button"
            className={styles.switchButton}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login
