import React, { useState } from "react";
import "./featured.scss";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Featured = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  // Retrieve current user from local storage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Current User:", currentUser);

  // Extract email from currentUser
  const email = currentUser?.email;
  const userId = currentUser?.userId;

  // Save search history function
  const saveSearchHistory = async (userId, searchQuery, email) => {
    const response = await newRequest.post("search/search-history", {
      userId,
      searchQuery,
      email,
    });
    return response.data;
  };

  // Query configuration to save search history
  const { refetch } = useQuery({
    queryKey: ["saveSearchHistory", currentUser?.userId, input],
    queryFn: () => saveSearchHistory(currentUser.userId, input, email),
    enabled: false, // Disable automatic refetching
    onSuccess: () => {
      console.log("Search history saved successfully");
      navigate(`/gigs?search=${input}`);
    },
    onError: (error) => {
      console.error("Error saving search history:", error);
    },
  });

  // Handle button click
  const handleClick = () => {
    if (currentUser && currentUser.userId) {
      refetch().then(() => {
        navigate(`/gigs?search=${input}`);
      });
    } else {
      console.log("User not logged in");
    }
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>FIND THE PERFECT FREELANCE SERVICES FOR YOUR BUSINESS</h1>
          <div className="search">
            <div className="searchInput">
              <img className="imgsearch" src="./img/search.png" alt="" />
              <input
                type="text"
                placeholder="Search By Category"
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            <button onClick={handleClick} className="searchbutton">
              Search
            </button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button className="button">
              <Link className="link" to="/Gigs">
                Work Design
              </Link>
            </button>
            <button className="button">
              <Link className="link" to="/Gigs">
                Wordpress
              </Link>
            </button>
            <button className="button">
              <Link className="link" to="/Gigs">
                Logo Design
              </Link>
            </button>
            <button className="button">
              <Link className="link" to="/Gigs">
                AI service
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
