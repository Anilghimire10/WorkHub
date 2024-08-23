import React from "react";
import "./ProjectCard.scss";
import { Link } from "react-router-dom";

const ProjectCard = ({ item }) => {
  const gigId = item.gigId || item._id;
  const backendURL = "http://localhost:8800";
  return (
    <Link to={`/gig/${gigId}`} className="link">
      <div className="projectCard">
        <img src={`${backendURL}/uploads/images/${item.cover}`} alt="" />{" "}
        <div className="info">
          <div className="texts">
            <h2>{item.title}</h2>
            <h2>{item.desc}</h2>
            <span>{item.category}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
