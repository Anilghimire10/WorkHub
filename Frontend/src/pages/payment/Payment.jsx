// src/pages/payment/Payment.jsx
import React, { useState } from "react";
import "./payment.css";

// Main Payment Component
const Payment = () => {
  const [selectedSection, setSelectedSection] = useState("BillingHistory");

  const renderSection = () => {
    switch (selectedSection) {
      case "BillingHistory":
        return <BillingHistory />;
      case "PaymentMethods":
        return <PaymentMethods />;
      default:
        return <BillingHistory />;
    }
  };

  return (
    <div className="App">
      <nav>
        <button onClick={() => setSelectedSection("BillingHistory")}>
          Billing History
        </button>
        <button onClick={() => setSelectedSection("PaymentMethods")}>
          Payment Methods
        </button>
      </nav>
      <div className="content">{renderSection()}</div>
    </div>
  );
};

// BillingHistory Component
const BillingHistory = () => {
  // Example billing data
  const billingData = [
    {
      username: "user1",
      date: "2024-08-20",
      document: "Invoice #1234",
      service: "Design Service",
      currency: "NPR",
      total: "Rs 500",
    },
    {
      username: "user2",
      date: "2024-08-21",
      document: "Invoice #5678",
      service: "Development Service",
      currency: "NPR",
      total: "Rs 300",
    },
    // Add more records...
  ];

  // State for filters
  const [filterUsername, setFilterUsername] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Filter function
  const filteredData = billingData.filter((item) => {
    const usernameMatch = item.username
      .toLowerCase()
      .includes(filterUsername.toLowerCase());
    const dateMatch = item.date.includes(filterDate);
    return usernameMatch && dateMatch;
  });

  return (
    <div>
      <h2>Billing History</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by Username"
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Document</th>
            <th>Service</th>
            <th>Currency</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.document}</td>
                <td>{item.service}</td>
                <td>{item.currency}</td>
                <td>{item.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// PaymentMethods Component (unchanged)
const PaymentMethods = () => (
  <div className="paymentmethod">
    <h2>Payment Methods</h2>
    <button className="buttonme">Khalti</button>
  </div>
);

export { Payment, BillingHistory, PaymentMethods };
