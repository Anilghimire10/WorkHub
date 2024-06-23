import React from "react";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Review.scss";

const Review = ({ review }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: [review.userId],
    queryFn: () =>
      newRequest.get(`user/${review.userId}`).then((res) => {
        console.log("User data response:", res.data);
        return res.data;
      }),
  });

  console.log("Review component - useQuery data:", data);
  console.log("Review component - useQuery isLoading:", isLoading);
  console.log("Review component - useQuery error:", error);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return null;

  return (
    <div className="review">
      <div className="user">
        <img className="pp" src={data.img || "/img/man.png"} alt="" />
        <div className="info">
          <span>{data.username}</span>
          <div className="country">
            <span>{data.country}</span>
          </div>
        </div>
      </div>
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.star}</span>
      </div>
      <p>{review.desc}</p>
      <div className="helpful">
        <span>Helpful?</span>
        <img src="/img/like.png" alt="" />
        <span>Yes</span>
        <img src="/img/dislike.png" alt="" />
        <span>No</span>
      </div>
    </div>
  );
};

export default Review;
