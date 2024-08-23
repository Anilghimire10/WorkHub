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
      const res = await newRequest.post("user/login", { email, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      console.log("Logged in user:", res.data);

      if (res.data.isSeller) {
        navigate("/freelancerprofile");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
      console.log(errorMessage);
    }
  };
  const handleGoogleAuth = () => {
    try {
      window.location.href = `http://localhost:8800/api/user/login/google`;
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <label htmlFor="username">Email</label>
        <input
          name="username"
          type="text"
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          name="password"
          value={password}
          type="password"
          placeholder="*******"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        <button
          type="button"
          className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 ml-3 hover:bg-red-700"
          onClick={handleGoogleAuth}
        >
          Sign in with Google
        </button>
        {/* {error && <div className="error-message">{error}</div>} */}
        <p className="registerone">
          Don't have an account?{" "}
          <Link style={{ textDecoration: "none" }} to="/register">
            Join here
          </Link>
        </p>

        <p className="terms">
          By joining, you agree to the Workhub Terms of Service. Please read our{" "}
          <Link style={{ textDecoration: "none" }} to="/privacy-policy">
            Privacy Policy
          </Link>{" "}
          to learn how we use your personal data.
        </p>
      </form>
    </div>
  );
};

export default Login;
