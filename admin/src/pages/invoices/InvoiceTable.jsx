import React, { useState, useEffect } from "react";
import DateFilter from "./DateFilter";

const InvoiceTable = ({ payments }) => {
  const [filteredPayments, setFilteredPayments] = useState(payments);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = payments.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return paymentDate >= start && paymentDate <= end;
      });
      setFilteredPayments(filtered);
    } else {
      setFilteredPayments(payments);
    }
  }, [startDate, endDate, payments]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>Invoice Listings</h1>
      <DateFilter
        // onFilterChange={(start, end) => {
        //   setStartDate(start);
        //   setEndDate(end);
        // }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Payment Date
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Transaction ID
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gig ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Merchant
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              User Name
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              User Phone
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.map((payment) => (
            <tr key={payment._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(payment.paymentDate).toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.transactionId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.gigId}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.amount}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.dataFromVerificationReq.merchant.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.dataFromVerificationReq.user.name.split(" (")[0]}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.dataFromVerificationReq.user.name
                  .split(" (")[1]
                  .replace(")", "")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
