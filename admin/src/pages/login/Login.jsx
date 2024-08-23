import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Authcontext";
import "./login.scss";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await fetch("http://localhost:8800/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: "You are not allowed to log in.",
        });
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "You are not allowed to log in.",
        });
        return;
      }

      const data = await response.json();
      console.log("Login response data:", data); // Debug the login response
      dispatch({ type: "LOGIN_SUCCESS", payload: data.details });

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in.",
      });

      console.log("Navigation triggered");
      navigate("/"); // Attempt to navigate to the home page after login
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.message });
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Login failed. Please try again.",
      });
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h2 className="admin_text">ADMIN LOGIN</h2>
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        {error && <span>{error}</span>}
      </div>
    </div>
  );
};

export default Login;
