import React from "react";
import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ReviewIcon from "@mui/icons-material/RateReview";
import AlbumIcon from "@mui/icons-material/Album"; // Import an icon for gigs, if available
import { Link } from "react-router-dom";

const Widget = ({ type, count }) => {
  let data = {}; // Initialize data to an empty object

  // Temporary values
  const amount = 12;
  const diff = 20;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        link: "See all users",
        onClick: "/user",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "review":
      data = {
        title: "REVIEWS",
        onClick: "/reviews",
        isMoney: false,
        link: "View all Reviews",
        icon: (
          <ReviewIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              color: "green",
            }}
          />
        ),
      };
      break;
    case "gig":
      data = {
        title: "GIGS",
        onClick: "/gigs",
        isMoney: false,
        link: "View all Gigs",
        icon: (
          <AlbumIcon
            className="icon"
            style={{
              backgroundColor: "rgba(0, 0, 255, 0.2)",
              color: "blue",
            }}
          />
        ),
      };
      break;
    default:
      // Handle the case where type does not match any of the cases
      data = {
        title: "Unknown",
        isMoney: false,
        link: "No link available",
        onClick: "#",
        icon: null,
      };
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {count}
        </span>
        <Link to={data.onClick}>
          <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        <div className="percentage positive"></div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
