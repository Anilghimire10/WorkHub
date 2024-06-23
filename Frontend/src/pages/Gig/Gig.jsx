import React, { useEffect, useState } from "react";
import "./gig.scss";
import { Slider } from "infinite-react-carousel";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();

  // State to track default image loading
  const [defaultImageLoaded, setDefaultImageLoaded] = useState(false);

  // Fetch gig data
  const {
    isLoading: isLoadingGig,
    error: errorGig,
    data: dataGig,
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`gig/single/${id}`).then((res) => res.data),
  });

  useEffect(() => {
    if (errorGig) {
      console.error("Error loading gig data:", errorGig);
    }
  }, [errorGig]);

  // Fetch user data if gig data is available
  const userId = dataGig?.gig?.userId;
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      userId ? newRequest.get(`user/${userId}`).then((res) => res.data) : null,
    enabled: !!userId,
  });

  useEffect(() => {
    if (errorUser) {
      console.error("Error loading user data:", errorUser);
    }
  }, [errorUser]);

  // Handle default image loading
  const handleDefaultImageLoad = () => {
    setDefaultImageLoaded(true);
  };

  // Default image path
  const defaultImagePath = "/img/man.png";

  if (isLoadingGig || isLoadingUser) return <div>Loading...</div>;
  if (errorGig || errorUser) {
    return (
      <div>Error loading data: {errorGig?.message || errorUser?.message}</div>
    );
  }
  if (!dataGig || !dataGig.gig) {
    return <div>No gig data available</div>;
  }

  const { gig } = dataGig;

  const renderStars = (totalStars, starNumber) => {
    if (!totalStars || !starNumber) return null;
    const starCount = Math.round(totalStars / starNumber);
    return (
      <div className="stars">
        {Array.from({ length: starCount }, (_, i) => (
          <img src="/img/star.png" alt="" key={i} />
        ))}
        <span>{starCount}</span>
      </div>
    );
  };

  return (
    <div className="gig">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Liverr : Graphics & Design :</span>
          <h1>{gig.title}</h1>
          {isLoadingUser ? (
            "Loading"
          ) : errorUser ? (
            "Something went wrong"
          ) : (
            <div className="user">
              <img className="pp" src="/img/userprof.avif" alt="" />
              <span>{dataUser?.user?.username || "User"}</span>
              {renderStars(gig.totalStars, gig.starNumber)}
            </div>
          )}
          <Slider slidesToShow={1} arrowsScroll={1} className="slider">
            {gig.images && gig.images.length > 0 ? (
              gig.images.map((img, index) => (
                <img key={index} src={img} alt={`Slide ${index}`} />
              ))
            ) : (
              <img
                src={defaultImagePath}
                alt="Default Image"
                onLoad={handleDefaultImageLoad}
                style={{ display: defaultImageLoaded ? "block" : "none" }}
              />
            )}
          </Slider>
          <h2>About This Gig</h2>
          <p>{gig.desc}</p>
          {isLoadingUser ? (
            "Loading..."
          ) : errorUser ? (
            "Something went wrong!"
          ) : (
            <div className="seller">
              <h2>About The Seller</h2>
              <div className="user">
                <img src={dataUser?.user?.img || "/img/man.png"} alt="" />
                <div className="info">
                  <span>{dataUser?.user?.username || "User"}</span>
                  <div className="stars">
                    {renderStars(gig.totalStars, gig.starNumber)}
                  </div>
                  <button>Contact Me</button>
                </div>
              </div>
              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{dataUser?.user?.country}</span>
                  </div>
                  <div className="item">
                    <span className="title">Member since</span>
                    <span className="desc">Apr 2023</span>
                  </div>
                  {/* <div className="item">
                    <span className="title">Avg. response time</span>
                    <span className="desc">6 hours</span>
                  </div>
                  <div className="item">
                    <span className="title">Last delivery</span>
                    <span className="desc">5 days</span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">English, Nepali</span>
                  </div> */}
                </div>
                <hr />
                <p>{dataUser?.user?.desc}</p>
              </div>
            </div>
          )}
          <Reviews gigId={id} />
        </div>
        <div className="right">
          <div className="price">
            <h3>{gig.shortTitle}</h3>
            <h2>$ {gig.price}</h2>
          </div>
          <p>{gig.shortDesc}</p>
          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>{gig.deliveryTime} Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>{gig.revisionNumber} Revisions</span>
            </div>
          </div>
          <div className="features">
            {gig.features && Array.isArray(gig.features) && (
              <div className="feature-list">
                {gig.features.map((feature, index) => (
                  <div className="feature-item" key={index}>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Gig;
