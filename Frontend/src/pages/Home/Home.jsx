import React from "react";
import "./home.scss";
import Featured from "../../components/featured/Featured";
import Trustedby from "../../components/trustedby/Trustedby";
import Slide from "../../components/slide/Slide";
import { cards, projects } from "../../Data";
import CatCard from "../../components/catcard/CatCard";
import ProjectCard from "../../components/projectCard/ProjectCard";

const Home = () => {
  return (
    <div className="home">
      <Featured />
      <Trustedby />
      <Slide slidesToShow={5} arrowsScroll={5}>
        {cards.map((card) => (
          <CatCard key={card.id} item={card} />
        ))}
      </Slide>
      <div className="features">
        <div className="container">
          <div className="item">
            <h1> A whole world of freelance talent at your fingertip.</h1>
            <table>
              <tr>
                <td>
                  <div className="title">
                    <img src="./img/check.png" alt="" />
                    The best for every budget
                  </div>
                  <p>
                    Find high quality services at every price point. No hourly
                    rates , Just project based pricing.
                  </p>
                  <div className="title">
                    <img src="./img/check.png" alt="" />
                    The quality work done quickly
                  </div>
                  <p>
                    Hand your project to a talented freelancer in minutes, get
                    long lasting results.
                  </p>
                </td>
                <td>
                  <div className="title">
                    <img src="./img/check.png" alt="" />
                    Pay when you're happy
                  </div>
                  <p>
                    Upfront quote means no suprises. Payments will only get
                    released when you approve.
                  </p>
                  <div className="title">
                    <img src="./img/check.png" alt="" />
                    Payment options specially for nepal
                  </div>
                  <p>
                    Get payment options such as Khalti, Esewa or IME pay as
                    payment options.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <Slide slidesToShow={4} arrowsScroll={4}>
        {projects.map((card) => (
          <ProjectCard key={card.id} item={card} />
        ))}
      </Slide>
    </div>
  );
};

export default Home;
