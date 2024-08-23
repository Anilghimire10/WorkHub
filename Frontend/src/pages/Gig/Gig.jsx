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

  const handleContact = async () => {
    const sellerId = dataGig?.gig?.userId;
    const buyerId = currentUser?.userId;

    if (!sellerId || !buyerId) {
      console.error("Seller ID or Buyer ID is missing.");
      return;
    }

    const conversationId = sellerId + buyerId; // Create a unique ID for the conversation
    console.log(`Generated Conversation ID: ${conversationId}`);

    try {
      // Step 1: Fetch existing conversation
      console.log(`Fetching conversation with ID: ${conversationId}`);
      const res = await newRequest.get(`conversation/single/${conversationId}`);
      console.log("Fetch Conversation Response:", res.data);

      const existingConversation = res.data?.conversation;

      if (existingConversation) {
        console.log("Existing Conversation Found:", existingConversation);
        // If conversation exists, navigate to it
        navigate(`/message/${existingConversation.id}`);
      } else {
        console.log("No existing conversation found, creating a new one.");
        // Step 2: Create a new conversation if it does not exist
        try {
          const createRes = await newRequest.post("conversation", {
            to: sellerId,
          });
          console.log("Create Conversation Response:", createRes.data);

          const newConversationId = createRes.data?.savedConversation?.id;

          if (newConversationId) {
            console.log("New Conversation Created with ID:", newConversationId);
            navigate(`/message/${newConversationId}`);
          } else {
            console.error("No new conversation ID returned.");
          }
        } catch (createErr) {
          console.error(
            "Error creating new conversation:",
            createErr.response?.data || createErr.message
          );
        }
      }
    } catch (fetchErr) {
      console.error(
        "Error fetching conversation:",
        fetchErr.response?.data || fetchErr.message
      );
    }
  };

  const handleContinue = () => {
    navigate("/Paymentdo", { state: { gig } });
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
