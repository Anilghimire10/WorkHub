import React, { useState, useEffect } from "react";
import axios from "axios";
import "./payment.css";
import getCurrentUser from "../../utils/getCurrentUser";

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
  const [billingData, setBillingData] = useState([]);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const currentUser = getCurrentUser();
  const userId = currentUser.userId;
  const isSeller = currentUser.isSeller;

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const params = {
          date: filterDate,
        };

        // Apply the correct filter based on whether the user is a seller or not
        if (isSeller) {
          params.sellerId = userId;
        } else {
          params.userId = userId;
        }

        // Remove parameters with empty values
        Object.keys(params).forEach(
          (key) => params[key] === "" && delete params[key]
        );

        const response = await axios.get(
          `http://localhost:8800/api/payment/payments`,
          { params }
        );
        console.log("API response data:", response.data); // Log API response
        setBillingData(response.data.data); // Assuming the API returns data in this format
      } catch (error) {
        console.error("Error fetching billing data:", error);
      }
    };

    fetchBillingData();
  }, [userId, filterDate, isSeller]);

  // Function to extract username and phone number
  const extractUsernameAndPhone = (fullName) => {
    const match = fullName.match(/(.*?)\s*\(([^)]+)\)/);
    return match
      ? { username: match[1].trim(), phone: match[2] }
      : { username: fullName, phone: "N/A" };
  };

  const filteredData = billingData.filter((item) => {
    const { username } = extractUsernameAndPhone(
      item.dataFromVerificationReq?.user?.name || ""
    );
    const usernameMatch = username
      .toLowerCase()
      .includes(filterUsername.toLowerCase());
    const dateMatch = item.paymentDate?.split("T")[0] === filterDate;
    return usernameMatch && dateMatch;
  });

  return (
    <div>
      <h2>Billing History</h2>
      <div className="filters">
        {/* <input
          type="text"
          placeholder="Filter by Username"
          value={filterUsername}
          onChange={(e) => setFilterUsername(e.target.value)}
        /> */}
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
            <th>Transaction ID</th>
            <th>GIG ID</th>
            <th>Gig Title</th>
            <th>Amount</th>
            {isSeller ? (
              <>
                <th>Received From</th>
                <th>Phone Number</th>
              </>
            ) : (
              <>
                <th>Receiver Email</th>
                <th>Receiver Name</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const { username, phone } = extractUsernameAndPhone(
                item.dataFromVerificationReq?.user?.name || ""
              );
              return (
                <tr key={index}>
                  <td>{new Date(item.paymentDate).toLocaleDateString()}</td>
                  <td>{item.transactionId}</td>
                  <td>{item.gigId}</td>
                  <td>{item.gigTitle}</td>
                  <td>{`Rs ${item.amount}`}</td>
                  {isSeller ? (
                    <>
                      <td>{username}</td> {/* Display username */}
                      <td>{phone}</td> {/* Display phone number */}
                    </>
                  ) : (
                    <>
                      <td>
                        {item.dataFromVerificationReq?.merchant?.email || "N/A"}
                      </td>
                      <td>
                        {item.dataFromVerificationReq?.merchant?.name || "N/A"}
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={isSeller ? 7 : 5}>No results found</td>{" "}
              {/* Adjust colspan based on the number of columns */}
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
