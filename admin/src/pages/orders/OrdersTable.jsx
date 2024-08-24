import React, { useState } from "react";

const OrderTable = ({ orders }) => {
  const [defaultImageLoaded, setDefaultImageLoaded] = useState(false);
  const backendURL = "http://localhost:8800";

  const handleImageLoad = (event) => {
    // Handle the image load event
    event.target.style.display = "block";
  };

  const handleImageError = (event) => {
    event.target.src = `${backendURL}/uploads/images/man.png`;
    event.target.style.display = "block";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>Order Listings</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Image</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>GigId</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Seller Id
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              BuyerId
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Title</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Price</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <img
                  src={`${backendURL}/uploads/images/${order.img}`}
                  alt=""
                  style={{
                    width: "100px",
                    display: defaultImageLoaded ? "block" : "none",
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.gigId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.sellerID}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.buyerID}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.title}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.price}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
