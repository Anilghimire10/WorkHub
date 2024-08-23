import React, { useEffect } from "react";
import "./home.scss";
import Featured from "../../components/featured/Featured";
import Trustedby from "../../components/trustedby/Trustedby";
import Slide from "../../components/slide/Slide";
import ProjectCard from "../../components/projectCard/ProjectCard";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../../utils/getCurrentUser";
import CatCard from "../../components/catcard/CatCard";

const Home = () => {
  const currentUser = getCurrentUser();
  console.log("CUrrent User:", currentUser);
  const userId = currentUser?.userId;

  // Fetch data using useQuery hook
  // const {
  //   isLoading: isLoadingRecommendations,
  //   error: errorRecommendations,
  //   data: dataRecommendations,
  //   refetch: refetchRecommendations,
  // } = useQuery({
  //   queryKey: ["recommendations", userId],
  //   queryFn: () =>
  //     axios
  //       .get(
  //         `http://localhost:5000/api/recommendations/search?userId=${userId}`
  //       )
  //       .then((res) => res.data),
  //   enabled: !!userId, // Only run query if userId is available
  // });

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

  // Log userId and dataRecommendations for debugging
  // useEffect(() => {
  //   console.log("Fetching recommendations for userId:", userId);
  //   console.log("Data recommendations:", dataRecommendations);
  // }, [userId, dataRecommendations]);

  useEffect(() => {
    console.log("Data Star recommendations:", dataStarRecommendations);
    console.log("Fetching star recommendations for userId:", userId);
  }, [dataStarRecommendations]);

  // Handle loading and error states for recommendations
  // if (isLoadingRecommendations) return <div>Loading recommendations...</div>;
  // if (errorRecommendations)
  //   return (
  //     <div>Error fetching recommendations: {errorRecommendations.message}</div>
  //   );

  // Conditional rendering based on search history availability
  // const hasSearchHistory =
  //   dataRecommendations &&
  //   dataRecommendations.recommendations_search.length > 0;

  return (
    <div className="home">
      <Featured />
      <Trustedby />
      {/* <Slide slidesToShow={3} arrowsScroll={3}>
        {cards.map((card) => (
          <CatCard key={card.id} item={card} />
        ))}
      </Slide> */}

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

      {/* {userId && hasSearchHistory && (
        <Slide slidesToShow={3} arrowsScroll={3}>
          {dataRecommendations.recommendations_search.map((item) => (
            <ProjectCard key={item._id} item={item} />
          ))}
        </Slide>
      )} */}

      {/* {dataStarRecommendations &&
        dataStarRecommendations.recommendations_star_ratings && (
          <Slide slidesToShow={3} arrowsScroll={3}>
            {dataStarRecommendations.recommendations_star_ratings.map(
              (item) => (
                <CatCard key={item.gigId || item._id} item={item} />
              )
            )}
          </Slide>
        )} */}
      {dataStarRecommendations?.recommendations_star_ratings?.length > 0 && (
        <Slide slidesToShow={3} arrowsScroll={3}>
          {dataStarRecommendations.recommendations_star_ratings.map((item) => (
            <CatCard key={item.gigId || item._id} item={item} />
          ))}
        </Slide>
      )}
    </div>
  );
};

export default Home;
