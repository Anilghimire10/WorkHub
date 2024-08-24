import React, { useEffect, useState } from "react";
import axios from "axios";
import "./invoices.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import InvoiceTable from "./InvoiceTable";

const Invoices = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(""); // State to store the selected date

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/payment/allPayment",
          {
            params: { date: selectedDate }, // Pass the selected date as a query parameter
          }
        );
        console.log("API Response:", res.data);

        if (res.data.success) {
          setPayments(Array.isArray(res.data.data) ? res.data.data : []);
        } else {
          setError("Failed to fetch payments.");
        }
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("An error occurred while fetching payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selectedDate]); // Fetch payments whenever the selected date changes

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <div style={{ padding: "20px" }}>
          <h1 style={{ marginBottom: 16 }}>Invoice Listings</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{ marginBottom: "20px" }}
          />
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <InvoiceTable payments={payments} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
