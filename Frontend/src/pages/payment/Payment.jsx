import React, { useState, useEffect, useRef } from "react";
import "./payment.css";

const Payment = () => {
  const [selectedSection, setSelectedSection] = useState("BillingHistory");
  const navRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    const activeButton = navRef.current.querySelector(".active");
    if (activeButton) {
      setUnderlineStyle({
        width: `${activeButton.offsetWidth}px`,
        transform: `translateX(${activeButton.offsetLeft}px)`,
      });
    }
  }, [selectedSection]);

  const handleClick = (section) => {
    setSelectedSection(section);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case "BillingHistory":
        return <BillingHistory />;
      case "BillingInformation":
        return <BillingInformation />;
      case "AvailableBalances":
        return <AvailableBalances />;
      case "PaymentMethods":
        return <PaymentMethods />;
      default:
        return <BillingHistory />;
    }
  };

  return (
    <div className="App">
      <nav ref={navRef}>
        <button
          className={selectedSection === "BillingHistory" ? "active" : ""}
          onClick={() => handleClick("BillingHistory")}
        >
          Billing History
        </button>
        <button
          className={selectedSection === "BillingInformation" ? "active" : ""}
          onClick={() => handleClick("BillingInformation")}
        >
          Billing Information
        </button>
        <button
          className={selectedSection === "AvailableBalances" ? "active" : ""}
          onClick={() => handleClick("AvailableBalances")}
        >
          Available Balances
        </button>
        <button
          className={selectedSection === "PaymentMethods" ? "active" : ""}
          onClick={() => handleClick("PaymentMethods")}
        >
          Payment Methods
        </button>
        <div className="nav-underline" style={underlineStyle}></div>
      </nav>
      <div className="content">{renderSection()}</div>
    </div>
  );
};

const BillingHistory = () => (
  <div>
    <h2>Billing History</h2>
    <input type="text" placeholder="Search orders..." />
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
        <tr>
          <td>2023-06-20</td>
          <td>Invoice #1234</td>
          <td>Design Service</td>
          <td>NPR</td>
          <td>Rs 5000</td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
  </div>
);

const BillingInformation = () => (
  <div>
    <h2>Billing Information</h2>
    <form>
      <label>
        Full Name:
        <input type="text" name="fullname" />
      </label>
      <label>
        Company Name:
        <input type="text" name="companyname" />
      </label>
      <label>
        State/City:
        <input type="text" name="statecity" />
      </label>
      <label>
        Postal Code:
        <input type="text" name="postalcode" />
      </label>
      <label>
        Tax ID:
        <input type="text" name="taxid" />
      </label>
      <button type="submit">Save</button>
    </form>
  </div>
);

const AvailableBalances = () => (
  <div>
    <h2>Available Balances</h2>
    <div className="balance-box">
      <h3>Cancelled Balances</h3>
      <p>Rs 1000</p>
    </div>
    <div className="balance-box">
      <h3>Credits</h3>
      <p>Rs 5000</p>
    </div>
  </div>
);

const PaymentMethods = () => (
  <div>
    <h2>Payment Methods</h2>
    <button>Pay with Khalti</button>
  </div>
);

export {
  Payment,
  BillingHistory,
  BillingInformation,
  AvailableBalances,
  PaymentMethods,
};
