import React, { useEffect } from "react";
import "./home.scss";
import Featured from "../../components/featured/Featured";
import Slide from "../../components/slide/Slide";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../../utils/getCurrentUser";
import CatCard from "../../components/catcard/CatCard";

const Home = () => {
  const currentUser = getCurrentUser();
  console.log("CUrrent User:", currentUser);
  const userId = currentUser?.userId;

  // Fetch data using useQuery hook

  const {
    isLoading: isLoadingStarRecommendations,
    error: errorStarRecommendations,
    data: dataStarRecommendations,
    refetch: refetchStarRecommendations,
  } = useQuery({
    queryKey: ["starrecommendations"],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/api/recommendations/stars`)
        .then((res) => res.data),
  });

  useEffect(() => {
    console.log("Data Star recommendations:", dataStarRecommendations);
    console.log("Fetching star recommendations for userId:", userId);
  }, [dataStarRecommendations]);

  return (
    <div className="home">
      <Featured />

      <div className="features">
        <div className="container">
          <div className="item">
            <h1>A whole world of freelance talent at your fingertip.</h1>
            <table>
              <tbody>
                <tr>
                  <td>
                    <div className="title">
                      <img src="./img/check.png" alt="" />
                      The best for every budget
                    </div>
                    <p>
                      Find high-quality services at every price point. No hourly
                      rates, Just project-based pricing.
                    </p>
                    <div className="title">
                      <img src="./img/check.png" alt="" />
                      Quality work done quickly
                    </div>
                    <p>
                      Hand your project to a talented freelancer in minutes, get
                      long-lasting results.
                    </p>
                  </td>
                  <td>
                    <div className="title">
                      <img src="./img/check.png" alt="" />
                      Pay when you're happy
                    </div>
                    <p>
                      Upfront quote means no surprises. Payments will only get
                      released when you approve.
                    </p>
                    <div className="title">
                      <img src="./img/check.png" alt="" />
                      Payment options specially for Nepal
                    </div>
                    <p>
                      Get payment options such as Khalti, Esewa, or IME Pay as
                      payment options.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="rated">
        {" "}
        <h2>Top Rated Gigs</h2>
        {dataStarRecommendations?.recommendations_star_ratings?.length > 0 && (
          <Slide slidesToShow={3} arrowsScroll={3}>
            {dataStarRecommendations.recommendations_star_ratings.map(
              (item) => (
                <CatCard key={item.gigId || item._id} item={item} />
              )
            )}
          </Slide>
        )}
      </div>
    </div>
  );
};

export default Home;
