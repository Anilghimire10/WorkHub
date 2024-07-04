import React, { useState } from "react";
import "./featured.scss";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Featured = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Current User:", currentUser);

  const saveSearchHistory = async (userId, searchQuery) => {
    const response = await newRequest.post("search/search-history", {
      userId,
      searchQuery,
    });
    return response.data;
  };

  const { refetch } = useQuery({
    queryKey: ["saveSearchHistory", currentUser?.userId, input],
    queryFn: () => saveSearchHistory(currentUser.userId, input),
    enabled: false, // Disable automatic refetching
    onSuccess: () => {
      console.log("Search history saved successfully");
      navigate(`/gigs?search=${input}`);
    },
    onError: (error) => {
      console.error("Error saving search history:", error);
    },
  });

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
                placeholder='Try "Building Mobile App"'
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
