import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./register.scss";

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    isSeller: false,
    desc: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to register as ${user.isSeller ? "a Seller" : "a Buyer"}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Register',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      const formData = new FormData();
      for (const key in user) {
        formData.append(key, user[key]);
      }
      if (file) {
        formData.append("image", file);
      }

      try {
        const response = await newRequest.post("user/signup", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Form data submitted successfully:", response.data);

        // Show success alert and then redirect to OTP page after 3 seconds
        await Swal.fire({
          text: 'An OTP has been sent to your email.',
          icon: 'success',
          timer: 3000, // Display for 3 seconds
          timerProgressBar: true,
          showConfirmButton: false,
        });

        navigate("/otp");
      } catch (err) {
        console.error("Error submitting form data:", err);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred while registering. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Create a new account</h1>
          <label htmlFor="">Username</label>
          <input
            name="username"
            type="text"
            placeholder="rajivprz"
            onChange={handleChange}
            required
          />
          <label htmlFor="">Email</label>
          <input
            name="email"
            type="email"
            placeholder="name@gmail.com"
            onChange={handleChange}
            required
          />
          <label htmlFor="">Password</label>
          <input
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
          <label htmlFor="">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Nepal"
            onChange={handleChange}
          />
          <button type="submit">Register</button>
        </div>
        <div className="right">
          <h3>I want to become a Seller</h3>
          <div className="toggle">
            <label htmlFor="">Activate the Seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Phone Number</label>
          <input
            name="phone"
            type="text"
            placeholder="+977 9826163997"
            onChange={handleChange}
            className="phno"
            required
          />
          <label htmlFor="">Description</label>
          <textarea
            placeholder="A short description of yourself"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}

export default Register;
