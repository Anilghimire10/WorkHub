import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./footer.scss";

// Function to fetch gigs using Axios
const fetchgigs = async () => {
  const response = await axios.get("http://localhost:8800/api/gig");
  console.log("Response data:", response.data);
  return response.data.gigs; // Extract gigs array
};

const Footer = () => {
  // Fetch gigs from the backend
  const {
    data: gigs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["gigs"],
    queryFn: fetchgigs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading gigs</div>;

  // Ensure gigs is an array before mapping
  const gigsArray = Array.isArray(gigs) ? gigs : [];

  // Create a Set to track unique categories
  const uniqueCategories = new Set();

  // Filter gigs to include only unique categories
  const filteredGigs = gigsArray.filter((gig) => {
    if (uniqueCategories.has(gig.category)) {
      return false; // Skip this gig if the category is already in the Set
    } else {
      uniqueCategories.add(gig.category); // Add the category to the Set
      return true; // Include this gig
    }
  });

  return (
    <div className="footer">
      <hr />
      <div className="container">
        <div className="top">
          <div className="item">
            <h2>Gigs</h2>
            {filteredGigs.map((gig) => (
              <button className="link1" key={gig._id}>
                <a href={`/Gigs?category=${gig.category}`}>{gig.category}</a>
              </button>
            ))}
          </div>
          <div className="item">
            <h2>About</h2>
            <button>Careers</button>
            <button>Press & News</button>
            <button>Partnerships</button>
            <button>Privacy Policy</button>
            <button>Terms of Service</button>
          </div>
          <div className="item">
            <h2>Support and Education</h2>
            <button>Help & Support</button>
            <button>Trust & Safety</button>
            <button>Selling on WorkHub</button>
            <button>Buying on WorkHub</button>
            <button>WorkHub Guides</button>
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <h2>WorkHub</h2>
            <button>© WorkHub Ltd. 2024</button>
          </div>
          <div className="right">
            <div className="social">
              <img src="/img/twitter.png" alt="Twitter" />
              <img src="/img/facebook.png" alt="Facebook" />
              <img src="/img/linkedin.png" alt="LinkedIn" />
              <img src="/img/pinterest.png" alt="Pinterest" />
              <img src="/img/instagram.png" alt="Instagram" />
            </div>

            {/* <div className="link">
              <button>NPR</button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
