import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./navbar.scss";
import newRequest from "../../utils/newRequest";

function Navbar() {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);

  const backendURL = "http://localhost:8800";

  const { pathname } = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'No, stay!',
    });

    if (result.isConfirmed) {
      try {
        await newRequest.get("user/logout");
        localStorage.removeItem("currentUser");
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        navigate("/");
      } catch (err) {
        console.log(err);
        Swal.fire({
          title: 'Error',
          text: 'An error occurred during logout. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleBecomeSeller = async () => {
    try {
      await newRequest.get("user/logout");
      navigate("/register");
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <span className="dot">|</span>
          <Link
            className="link"
            to={
              currentUser && currentUser.isSeller ? "/freelancerprofile" : "/"
            }
          >
            <span className="text">WorkHub</span>
          </Link>
          <span className="dot">|</span>
        </div>
        <div className="links">
          {currentUser && !currentUser.isSeller && (
            <Link to="/register" className="link" onClick={handleBecomeSeller}>
              Become a Seller
            </Link>
          )}
          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img
                src={
                  `${backendURL}/uploads/images/${currentUser.img}` ||
                  "/img/userprof.avif"
                }
                alt=""
              />
              <span>{currentUser.username}</span>
              {open && (
                <div className="options">
                  {currentUser.isSeller ? (
                    <>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                      <Link className="link" to="/mygigs">
                        MyGigs
                      </Link>
                      <Link className="link" to="/messages">
                        Messages
                      </Link>
                      <Link className="link" to="/orders">
                        Orders
                      </Link>
                      <Link className="link" onClick={handleLogout}>
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link className="link" to="/orders">
                        Orders
                      </Link>
                      <Link className="link" to="/profile">
                        Profile
                      </Link>
                      <Link className="link" to="/messages">
                        Messages
                      </Link>
                      <Link className="link" to="/payment">
                        Billing & Payments
                      </Link>
                      <Link className="link" onClick={handleLogout}>
                        Logout
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
