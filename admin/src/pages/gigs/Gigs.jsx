import "./gigs.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import GigTable from "./GigsTable";
import { useEffect, useState } from "react";
import axios from "axios";

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/gig/all");
        console.log(response.data.gigs);
        setGigs(response.data.gigs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <GigTable gigs={gigs} />
      </div>
    </div>
  );
};

export default Gigs;
