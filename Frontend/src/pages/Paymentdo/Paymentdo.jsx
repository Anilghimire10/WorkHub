import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./paymentdo.scss";

const PaymentDo = () => {
  const { state } = useLocation();
  const gig = state?.gig || {
    title: "Default Gig Title",
    amount: 1000,
    details: "Default gig details",
    serviceFee: 50,
    total: 1050,
    deliveryTime: 3,
  };

  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const handleContinueToPay = () => {
    setShowPaymentPopup(true);
  };

  const handleKhaltiPayment = () => {
    // Integrate Khalti payment here
    alert("Khalti payment initiated");
  };

  const handleClosePopup = () => {
    setShowPaymentPopup(false);
  };

  const {
    title,
    amount,
    details,
    serviceFee,
    total,
    deliveryTime,
    coverImage,
  } = gig;

  return (
    <div className="payment-do">
      <h1>PAYMENT DETAILS</h1>
      <div className="payment-info">
        <div className="gig-header">
          <div className="gig-cover-image">
            <img src={coverImage} alt="Gig Cover" />
          </div>
          <div className="gig-title">{title}</div>
        </div>
        <div className="gig-details">
          <span>Short Description: </span>
          {details}
        </div>
        <div className="service-fee">
          <span>Service Fee: </span>Rs {serviceFee}
        </div>
        <div className="total">
          <span>Total: </span>Rs {total}
        </div>
        <div className="delivery-time">
          <span>Delivery Time: </span>
          {deliveryTime} days
        </div>
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
              <strong>Amount: </strong>Rs {amount}
            </p>
            <p>
              <strong>Service Fee: </strong>Rs {serviceFee}
            </p>
            <p>
              <strong>Total: </strong>Rs {total}
            </p>
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
