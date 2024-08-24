import React, { useState } from "react";

const UsersTable = ({ users }) => {
  const [defaultImageLoaded, setDefaultImageLoaded] = useState(false);
  const backendURL = "http://localhost:8800"; // Define your backend URL here

  const handleImageLoad = (event) => {
    // Handle the image load event
    event.target.style.display = "block";
  };

  const handleImageError = (event) => {
    // If image fails to load, show a default image
    event.target.src = `${backendURL}/uploads/images/man.png`;
    event.target.style.display = "block";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>User Listings</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Image</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Username
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Country
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <img
                  src={`${backendURL}/uploads/images/${user.img}`}
                  alt={`Profile of ${user.username}`}
                  style={{
                    width: "100px",
                    display: defaultImageLoaded ? "block" : "none",
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.email}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.username}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.country}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {user.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
