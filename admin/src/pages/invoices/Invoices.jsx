import React, { useEffect, useState } from "react";
import axios from "axios";
import "./invoices.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import InvoiceTable from "./InvoiceTable";

const Invoices = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    // Fetch payment data from the API
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/payment/allPayment"
        );

        // Log the response to check if it's an array
        console.log("API Response:", res.data);

        // Ensure payments is an array
        setPayments(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setPayments([]); // Set payments to an empty array on error
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <InvoiceTable payments={payments} />{" "}
        {/* Pass the payments data to InvoiceTable */}
      </div>
    </div>
  );
};

export default Invoices;
