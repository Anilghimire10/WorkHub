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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data || !data.user) return null;

  const user = data.user;

  return (
    <div className="review">
      <div className="user">
        <img className="pp" src={user.img || "/img/man.png"} alt="" />
        <div className="info">
          <span>{user.username}</span>
          <div className="country">
            <span>{user.country}</span>
          </div>
        </div>
      </div>
      <div className="stars">
        {Array(review.star)
          .fill()
          .map((_, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.star}</span>
      </div>
      <p>{review.desc}</p>
    </div>
  );
};

export default Review;
