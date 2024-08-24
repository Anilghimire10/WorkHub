import React from "react";
import "./catcard.scss";
import { Link } from "react-router-dom";

const CatCard = ({ item }) => {
  const gigId = item.gigId || item._id;
  const backendURL = "http://localhost:8800";

  const handleClick = (event) => {
    // Scroll to the top of the page
    window.scrollTo(0, 0);
  };

  return (
    <Link to={`/gig/${gigId}`} onClick={handleClick}>
      <div className="catCard">
        <img
          src={`${backendURL}/uploads/images/${item.cover}`}
          alt="Product Image"
        />
        <div className="describe">
          <span className="title">{item.title}</span>
          <span className="desc">{item.desc}</span>
        </div>
      </div>
    </Link>
  );
};

export default CatCard;
