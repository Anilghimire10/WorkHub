import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const GigCard = ({ item }) => {
  // Log the userId to verify it's being passed correctly
  console.log("User ID:", item.userId);

  const { isLoading, error, data } = useQuery({
    queryKey: [item.userId],
    queryFn: () =>
      newRequest.get(`user/${item.userId}`).then((res) => {
        return res.data;
      }),
  });

  const userImg = data ? data.img || "/img/noavatar.jpg" : "/img/noavatar.jpg";
  const username = data ? data.username : "Unknown User";

  return (
    <Link to={`/gig/${item._id}`} className="link">
      <div className="gigCard">
        <img src={item.cover} alt={item.title} />
        <div className="info">
          {isLoading ? (
            "Loading..."
          ) : error ? (
            "Something went wrong!"
          ) : (
            <div className="user">
              <img src={userImg} alt={username} />
              <span>{username}</span>
            </div>
          )}
          <p>{item.desc}</p>
          <div className="star">
            <img src="./img/star.png" alt="star" />
            <span>
              {item.starNumber > 0
                ? Math.round(item.totalStars / item.starNumber)
                : "No ratings"}
            </span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="heart" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>$ {item.price}</h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
