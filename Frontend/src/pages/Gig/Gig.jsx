import React, { useEffect, useState } from "react";
import "./gig.scss";
import { Slider } from "infinite-react-carousel";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useParams, useNavigate } from "react-router-dom";
import Reviews from "../../components/reviews/Reviews";

function Gig() {
  const { id } = useParams();
  const backendURL = "http://localhost:8800";
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const [defaultImageLoaded, setDefaultImageLoaded] = useState(false);

  const {
    isLoading: isLoadingGig,
    error: errorGig,
    data: dataGig,
  } = useQuery({
    queryKey: ["gig", id],
    queryFn: () => newRequest.get(`gig/single/${id}`).then((res) => res.data),
  });

  useEffect(() => {
    if (dataGig) {
      console.log("Gig Data:", dataGig);
    }
    if (currentUser) {
      console.log("Current User:", currentUser);
    }
    if (errorGig) {
      console.error("Error loading gig data:", errorGig);
    }
  }, [dataGig, currentUser, errorGig]);

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
    if (dataUser) {
      console.log("User Data:", dataUser);
    }
    if (errorUser) {
      console.error("Error loading user data:", errorUser);
    }
  }, [dataUser, errorUser]);

  const handleDefaultImageLoad = () => {
    setDefaultImageLoaded(true);
  };

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
  const mediaFiles = [...(gig.images || []), ...(gig.videos || [])];

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

  const handleContact = async (order) => {
    const sellerId = dataGig?.gig?.userId;
    const buyerId = currentUser?.userId;
    const id = sellerId + buyerId;
    try {
      const res = await newRequest.get(`/conversation/single/${id}`);
      // console.log("Response data from get request:", res.data);
      const conversationId = res.data.conversation.id; // Access the id within the conversation object
      // console.log("Existing conversation ID:", conversationId);
      navigate(`/message/${conversationId}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        const res = await newRequest.post(`/conversation/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        // console.log("Response data from post request:", res.data); // Log the entire response data

        // Access the ID from savedConversation
        const newConversationId = res.data.savedConversation.id;
        // console.log("New conversation created with ID:", newConversationId);

        if (newConversationId) {
          navigate(`/message/${newConversationId}`);
        } else {
          console.error("Failed to retrieve the new conversation ID");
        }
      } else {
        console.error("Error fetching conversation:", err);
      }
    }
  };

  // const handleContact = async (order) => {
  //   const sellerId = dataGig?.gig?.userId;
  //   const buyerId = currentUser?.userId;
  //   const id = sellerId + buyerId;

  //   try {
  //     // Fetch existing conversation
  //     const res = await newRequest.get(`conversation/single/${id}`);

  //     // Extract conversation ID from the response
  //     const conversationId = res.data.conversation
  //       ? res.data.conversation.id
  //       : null;

  //     if (conversationId) {
  //       navigate(`/message/${conversationId}`);
  //     } else {
  //       console.error("No conversation ID returned in response.");
  //     }
  //   } catch (err) {
  //     if (err.response && err.response.status === 400) {
  //       try {
  //         // Create a new conversation
  //         const res = await newRequest.post(`conversation`, {
  //           to: currentUser.seller ? buyerId : sellerId,
  //         });

  //         const newConversationId = res.data.savedConversation.id;

  //         if (newConversationId) {
  //           navigate(`/message/${newConversationId}`);
  //         } else {
  //           console.error("No new conversation ID returned.");
  //         }
  //       } catch (postErr) {
  //         console.error("Error creating new conversation:", postErr);
  //       }
  //     } else {
  //       console.error("Error fetching conversation:", err);
  //     }
  //   }
  // };

  const handleContinue = () => {
    navigate("/Paymentdo", { state: { gig } });
    scrollToTop(); // Scroll to top when navigating to payment
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="gig">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">Fiverr : Graphics & Design :</span>
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
            {mediaFiles.length > 0 ? (
              mediaFiles.map((file, index) => (
                <div key={index} className="media-slide">
                  {file.endsWith(".mp4") ? (
                    <video controls>
                      <source
                        src={`${backendURL}/uploads/videos/${file}`}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={`${backendURL}/uploads/images/${file}`}
                      alt={`Slide ${index}`}
                    />
                  )}
                </div>
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
                  <button onClick={handleContact}>Contact Me</button>
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
          <button onClick={handleContinue}>Continue</button>
        </div>
      </div>
    </div>
  );
}

export default Gig;
