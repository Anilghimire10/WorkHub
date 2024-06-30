import React, { useState } from "react";
import "./featured.scss";
import { Link, useNavigate } from "react-router-dom";

const Featured = () => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/gigs?search=${input}`);
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
