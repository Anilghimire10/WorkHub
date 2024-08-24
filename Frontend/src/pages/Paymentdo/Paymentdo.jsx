import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import KhaltiCheckout from "khalti-checkout-web";
import "./paymentdo.scss";
import getCurrentUser from "../../utils/getCurrentUser";

const PaymentDo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gig } = location.state || {};

  const [paymentData, setPaymentData] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  if (!gig) {
    console.error("Gig data is missing. Redirecting...");
    navigate(-1);
    return null;
  }

  // Console logs for debugging
  console.log("Gig User ID:", gig.userId);
  const currentUser = getCurrentUser();
  const userId = currentUser.userId;
  // const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log("Logged-in User ID:", currentUser?.userId);

  const config = {
    publicKey: "test_public_key_ee71705cad0e48279ef9a71a6ef42b75",
    productIdentity: gig._id,
    productName: gig.title,
    productUrl: "http://google.com",
    eventHandler: {
      async onSuccess(payload) {
        try {
          // Ensure you have the correct sellerId
          const sellerId = gig.userId; // Make sure gig.userId is the seller's ID

          // Verify payment with Khalti
          const response = await axios.post(
            "http://localhost:8800/api/payment/khalti",
            {
              token: payload.token,
              amount: payload.amount,
              gigId: gig._id,
              title: gig.title,
              sellerId: gig.userId,
              userId: currentUser?.userId,
            }
          );

          if (response.data.success) {
            // Save response data for confirmation
            setPaymentData(response.data.data);

            // Create the order after successful payment
            await axios.post(
              `http://localhost:8800/api/order/${gig._id}`,
              {
                buyerID: response.data.data.userId,
                price: gig.price,
                title: gig.title,
                desc: gig.desc,
                deliveryTime: gig.deliveryTime,
                isCompleted: true,
                paymentMethod: "khalti",
                buyerName: response.data.data.buyerName, // Include buyer's name
                buyerPhone: response.data.data.buyerPhone, // Include buyer's phone number
              },
              {
                withCredentials: true,
              }
            );

            alert("Order Successful! Your order has been created.");
            navigate("/orders");
          } else {
            alert("Failed to verify payment. Please try again later.");
          }
        } catch (error) {
          console.error("Order failed:", error);
          alert("Order failed. Please try again later.");
        }
      },
      onError(error) {
        console.error("Khalti error:", error);
        alert("Payment failed. Please try again later.");
      },
      onClose() {
        console.log("Khalti widget is closing");
      },
    },
    paymentPreference: ["KHALTI"],
  };

  let checkout = new KhaltiCheckout(config);

  const handleContinueToPay = () => {
    setShowPaymentPopup(true);
  };

  const handleClosePopup = () => {
    setShowPaymentPopup(false);
  };

  const { title, price, desc, deliveryTime, cover, shortDesc, images } = gig;

  const handleKhaltiPayment = () => {
    checkout.show({ amount: price * 100 });
  };

  return (
    <div className="payment-do">
      <h1>PAYMENT DETAILS</h1>
      <div className="payment-info">
        <div className="gig-header">
          <div className="gig-title">{title}</div>
        </div>
        <div className="gig-details">
          <span>Short Description: </span>
          {shortDesc}
        </div>
        <div className="gig-details">
          <span>Description: </span>
          {desc}
        </div>
        <div className="total">
          <span>Total: </span>Rs {price}
        </div>
        <div className="delivery-time">
          <span>Delivery Time: </span>
          {deliveryTime} days
        </div>
        {/* <div className="gig-images">
          <span>Images: </span>
          <div className="image-gallery">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Gig Image ${index + 1}`} />
            ))}
          </div>
        </div> */}
        <button className="continue-to-pay" onClick={handleContinueToPay}>
          Continue to Pay
        </button>
      </div>
      {showPaymentPopup && (
        <div className="payment-popup" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>Confirm Payment</h2>
            <p>
              <strong>Title: </strong>
              {title}
            </p>
            <p>
              <strong>Amount: </strong>Rs {price}
            </p>
            {paymentData && (
              <>
                <p>
                  <strong>Buyer Name: </strong>
                  {paymentData.buyerName}
                </p>
                <p>
                  <strong>Buyer Phone: </strong>
                  {paymentData.buyerPhone}
                </p>
              </>
            )}
            <button className="khalti-payment" onClick={handleKhaltiPayment}>
              Pay with Khalti
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDo;
