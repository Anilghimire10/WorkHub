import React, { useState } from "react";

const DateFilter = ({ onFilterChange }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = () => {
    onFilterChange(startDate, endDate);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ marginRight: "10px" }}>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label style={{ marginLeft: "20px", marginRight: "10px" }}>
        End Date:
      </label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={handleDateChange} style={{ marginLeft: "10px" }}>
        Apply
      </button>
    </div>
  );
};

export default DateFilter;
