import React from "react";

const GigTable = ({ gigs }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>Gig Listings</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Cover Image
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Title</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Description
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Price (Rs)
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Category
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Total Stars
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Number of Reviews
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Delivery Time
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Sales</th>
          </tr>
        </thead>
        <tbody>
          {gigs.map((gig) => (
            <tr key={gig._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <img src={gig.cover} alt="Cover" style={{ width: "100px" }} />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.title}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.desc}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.price}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.category}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.totalStars}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.starNumber}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.deliveryTime}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {gig.sales}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GigTable;
