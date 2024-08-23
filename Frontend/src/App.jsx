import React, { useEffect, useState } from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home/Home";
import Gigs from "./pages/Gigs/Gigs";
import Gig from "./pages/Gig/Gig";
import Add from "./pages/Add/Add";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/profile/Profile";
import Messages from "./pages/Messages/Messages";
import Message from "./pages/Message/Message";
import MyGigs from "./pages/MyGigs/MyGigs";
import PaymentDo from "./pages/Paymentdo/Paymentdo";
import Otp from "./pages/otp/Otp";
import { Payment } from "./pages/payment/Payment";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Freelancerprofile from "./pages/freelancerprofile/Freelancerprofile";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import getCurrentUser from "./utils/getCurrentUser"; // Import the getCurrentUser utility
import "./App.css";

function App() {
  const queryClient = new QueryClient();
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          "http://localhost:8800/api/user/login/success",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        if (response.status === 200) {
          const resObject = await response.json();
          setCurrentUser(resObject.user);
          localStorage.setItem("currentUser", JSON.stringify(resObject.user));
        } else {
          throw new Error("Authentication failed!");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const Layout = () => {
    const navigate = useNavigate(); // Now it's inside a component rendered by Router

    const handleLogout = async () => {
      try {
        const response = await fetch("http://localhost:8800/api/user/logout", {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          localStorage.removeItem("currentUser");
          setCurrentUser(null);
          navigate("/login"); // Redirect to login page
        } else {
          throw new Error("Logout failed!");
        }
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar onLogout={handleLogout} />
          <Outlet context={{ currentUser }} />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/Paymentdo", element: <PaymentDo /> },
        { path: "/gigs", element: <Gigs /> },
        { path: "/gig/:id", element: <Gig /> },
        { path: "/orders", element: <Orders /> },
        { path: "/otp", element: <Otp /> },
        { path: "/profile", element: <Profile /> },
        { path: "/payment", element: <Payment /> },
        { path: "/mygigs", element: <MyGigs /> },
        { path: "/add", element: <Add /> },
        { path: "/messages", element: <Messages /> },
        { path: "/message/:id", element: <Message /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        { path: "/freelancerprofile", element: <Freelancerprofile /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
