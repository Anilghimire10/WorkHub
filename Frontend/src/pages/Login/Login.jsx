import React, { useState } from "react";
import "./login.scss";
import newRequest from "../../utils/newRequest";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

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
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
      console.log(errorMessage);
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    try {
      const res = await newRequest.post("user/google-login", {
        token: response.credential,
      });
      localStorage.setItem("currentUser", JSON.stringify(res.data));
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
      console.log(errorMessage);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    setError("Google login failed. Please try again.");
    console.log(error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
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
          {error && <div className="error-message">{error}</div>}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            render={(renderProps) => (
              <button
                className="google-login"
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                Login with Google
              </button>
            )}
          />
          <p className="registerone">
            Don't have an account?{" "}
            <Link style={{ textDecoration: "none" }} to="/register">
              Join here
            </Link>
          </p>
          <p className="terms">
            By joining, you agree to the Workhub Terms of Service. Please read
            our{" "}
            <Link style={{ textDecoration: "none" }} to="/privacy-policy">
              Privacy Policy
            </Link>{" "}
            to learn how we use your personal data.
          </p>
        </form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
