import React from "react";

const ReviewTable = ({ review }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>review Listings</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gig ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              User ID
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Stars</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {review.map((review) => (
            <tr key={review._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {review.gigId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {review.userId}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {review.star}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {review.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewTable;
