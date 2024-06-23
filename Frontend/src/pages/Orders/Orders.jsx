import React from "react";
import "./orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const res = await newRequest.get(`order`);
        return res.data;
      } catch (err) {
        console.error("Error fetching orders:", err);
        throw err; // Rethrow the error to be caught by React Query
      }
    },
  });

  console.log(data, "hehe");

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`conversation/single/${id}`);
      navigate(`message/${res.data.id}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        try {
          const res = await newRequest.post(conversation, {
            to: currentUser.seller ? buyerId : sellerId,
          });
          navigate(`message/${res.data.id}`);
        } catch (postErr) {
          console.error("Error creating new conversation:", postErr);
        }
      } else {
        console.error("Error fetching conversation:", err);
      }
    }
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>Orders</h1>
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {data.orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <img className="image" src={order.img} />
                </td>
                <td>{order.title}</td>
                <td>{order.price}</td>
                <td>
                  <img
                    className="message"
                    src={order.img}
                    alt="Contact"
                    onClick={() => handleContact(order)}
                    height="100px"
                    width="100px"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
