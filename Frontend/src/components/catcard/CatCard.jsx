import React from "react";
import "./catcard.scss";
import { Link } from "react-router-dom";

const CatCard = ({ item }) => {
  const gigId = item.gigId || item._id;
  const backendURL = "http://localhost:8800";
  return (
    <Link to={`/gig/${gigId}`}>
      <div className="catCard">
        <img src={`${backendURL}/uploads/${item.cover}`} alt="Product Image" />
        <span className="desc">{item.desc}</span>
        <span className="title">{item.title}</span>
      </div>
    </Link>
  );
};

export default CatCard;
