import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(res.data));
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <p>
        New user? <a href="/register">Register here</a>
      </p>
    </form>
  );
}
