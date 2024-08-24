import React, { useEffect, useRef, useState } from "react";
import "./gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation, useNavigate } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(""); // State for search input
  const minRef = useRef();
  const maxRef = useRef();
  const { search } = useLocation();
  const navigate = useNavigate();

  const buildUrl = () => {
    const baseUrl = "gig";
    const min = minRef.current.value;
    const max = maxRef.current.value;
    const params = new URLSearchParams(search);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    params.set("sort", sort);
    return `${baseUrl}?${params.toString()}`;
  };

  const { isLoading, error, data, refetch } = useQuery({
    queryKey: ["gigs", search, sort],
    queryFn: () => newRequest.get(buildUrl()).then((res) => res.data),
  });

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [sort, search]);

  const handleSearch = () => {
    navigate(`/gigs?search=${input}`);
  };

  useEffect(() => {
    console.log("Data from API:", data);
  }, [data]);

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">WorkHub</span>
        <h1>AI Artists</h1>
        <p>Explore the boundaries of art and technology with WorkHub</p>

        {/* Search Box Section */}
        <div className="search">
          <div className="searchInputWrapper">
            <input
              type="text"
              placeholder="Search By Category"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <img className="imgsearch" src="./img/search.png" alt="" />
          </div>
          <button onClick={handleSearch} className="searchbutton">
            Search
          </button>
        </div>

        {/* Budget Section */}
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
        </div>

        {/* Gigs Display Section */}
        <div className="cards">
          {isLoading
            ? "Loading..."
            : error
            ? "Something went wrong!"
            : data && Array.isArray(data.gigs)
            ? data.gigs.map((gig) => <GigCard key={gig._id} item={gig} />)
            : "No gigs found"}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
