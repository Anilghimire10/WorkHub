import React, { useState } from "react";
import "./login.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("/user/login", { email, password });
      // Store the entire user object or at least user ID in localStorage
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "An unexpected error occurred");
      console.log(err.response.data); // Log full error response for debugging
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          placeholder="rajivprz@gmail.com"
          autoComplete="current-email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          value={password}
          type="password"
          placeholder="********"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <div className="error-message">{error}</div>}
        <p className="registerone">
          Don't have an account? <Link to="/register">Join here</Link>
        </p>
        <p className="terms">
          By joining, you agree to the Workhub Terms of Service and to
          occasionally receive emails from us. Please read our{" "}
          <Link to="/privacy-policy">Privacy Policy</Link> to learn how we use
          your personal data.
        </p>
      </form>
    </div>
  );
};

export default Login;
