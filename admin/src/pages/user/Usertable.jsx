import React from "react";

const UsersTable = ({ users }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>user Listings</h1>
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
                <img src={user.img} style={{ width: "100px" }} />
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
