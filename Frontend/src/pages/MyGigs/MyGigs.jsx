// MyGigs.jsx

import React from "react";
import { Link } from "react-router-dom";
import "./myGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", currentUser.id],
    queryFn: () =>
      newRequest.get(`gig?userId=${currentUser.id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`gig/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs", currentUser.id]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  React.useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("Current User ID:", currentUser.id);
    console.log("Data from useQuery:", data);
  }, [currentUser, data]);

  if (isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Gigs</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button>Add New Gig</button>
            </Link>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) ? (
              data.map((gig) => (
                <tr key={gig._id}>
                  <td>
                    <img className="image" src={gig.cover} alt="" />
                  </td>
                  <td>{gig.title}</td>
                  <td>{gig.price}</td>
                  <td>{gig.sales}</td>
                  <td>
                    <img
                      className="delete"
                      src="./img/delete.png"
                      alt=""
                      onClick={() => handleDelete(gig._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No gigs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyGigs;
