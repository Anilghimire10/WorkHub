import React from "react";

const InvoiceTable = ({ payments }) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: 16 }}>Invoice Listings</h1>
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
              Receiver
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Received From
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Phone Number
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
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
