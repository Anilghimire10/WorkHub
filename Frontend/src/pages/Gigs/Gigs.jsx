import React, { useEffect, useRef, useState } from "react";
import "./gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useLocation } from "react-router-dom";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();

  const { search } = useLocation();

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

  console.log("Data from API:", data);

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  useEffect(() => {
    refetch();
  }, [sort, search]);

  const apply = () => {
    refetch();
  };

  return (
    <div className="gigs">
      <div className="container">
        <span className="breadcrumbs">Liverr Graphics & Design </span>
        <h1>AI Artists</h1>
        <p>
          Explore the boundaries of art and technology with Liverr's AI artists
        </p>
        <div className="menu">
          <div className="left">
            <span>Budget</span>
            <input ref={minRef} type="number" placeholder="min" />
            <input ref={maxRef} type="number" placeholder="max" />
            <button onClick={apply}>Apply</button>
          </div>
          <div className="right">
            <span className="sortBy">Sort by</span>
            <span className="sortType">
              {sort === "sales" ? "Best Selling" : "Newest"}
            </span>
            <img src="./img/down.png" alt="" onClick={() => setOpen(!open)} />
            {open && (
              <div className="rightMenu">
                {sort === "sales" ? (
                  <span onClick={() => reSort("createdAt")}>Newest</span>
                ) : (
                  <span onClick={() => reSort("sales")}>Best Selling</span>
                )}
                <span onClick={() => reSort("sales")}>Popular</span>
              </div>
            )}
          </div>
        </div>
        <div className="cards">
          {isLoading
            ? "Loading..." // Display a loading indicator
            : error
            ? "Something went wrong!" // Display an error message
            : data && Array.isArray(data.gigs) // Ensure data is defined and data.gigs is an array
            ? data.gigs.map((gig) => <GigCard key={gig._id} item={gig} />)
            : "No gigs found"}{" "}
          {/* Handle case where data.gigs is not an array */}
        </div>
      </div>
    </div>
  );
}

export default Gigs;
