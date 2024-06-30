import React from "react";
import { Link } from "react-router-dom";
import "./myGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  console.log("Current user:", currentUser);

  // Log user ID after fetching
  React.useEffect(() => {
    console.log(
      "Current User ID:",
      currentUser && currentUser.userId ? currentUser.userId : "Not logged in"
    );
  }, [currentUser]);

  const { isLoading, data } = useQuery({
    queryKey: ["myGigs", currentUser?.userId], // Use currentUser?.userId as part of the query key
    queryFn: () =>
      newRequest
        .get(`gig/user/${currentUser?.userId}`)
        .then((res) => res.data.gigs), // Ensure currentUser?.userId is used safely
    enabled: !!currentUser?.userId, // Ensure currentUser?.userId is truthy before enabling the query
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`gig/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  if (!currentUser || !currentUser.userId) {
    return <h1>User not logged in</h1>;
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
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
            {data.map((gig) => (
              <tr key={gig._id}>
                <td>
                  <img
                    src={"https://i.ibb.co/qF53C6g/tiger-jpg.jpg"}
                    width={70}
                    height={50}
                    alt=""
                  />
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyGigs;
