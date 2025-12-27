import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/register", form);
    localStorage.setItem("user", JSON.stringify(res.data));
    window.location.href = "/dashboard";
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Register</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        placeholder="Email"
        type="email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <button type="submit">Create Account</button>

      <p>
        Already registered? <a href="/">Login</a>
      </p>
    </form>
  );
}
