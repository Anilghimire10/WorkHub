import React, { useRef, useState } from "react";
import "./otp.scss";

const VerifyOTP = () => {
  const length = 5; // Default length for OTP input
  const inputRef = useRef(Array(length).fill(null));
  const [OTP, setOTP] = useState(Array(length).fill(""));

  const handleTextChange = (input, index) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    if (newPin.every((digit) => digit !== "")) {
      // Handle OTP verification or submission here
      console.log("Completed OTP:", newPin.join(""));
      // Uncomment below line to simulate submission after 1 second
      // setTimeout(() => onComplete(newPin.join("")), 1000);
    }
  };

  const handleSubmit = () => {
    const pin = OTP.join("");
    console.log("Submitting OTP:", pin);
    // Uncomment below line to handle OTP submission
    // onComplete(pin);
  };

  const handleCancel = () => {
    console.log("Cancelled");
    // Clear OTP input and reset state
    setOTP(Array(length).fill(""));
    inputRef.current[0]?.focus(); // Focus on the first input
  };

  return (
    <div className="verify-user">
      <h2>Verify OTP</h2>
      <p>An OTP has been sent to your email address, kindly enter it here</p>
      <div className="otp-input-container">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={OTP[index]}
            onChange={(e) => handleTextChange(e.target.value, index)}
            ref={(ref) => (inputRef.current[index] = ref)}
            className="otp-input"
          />
        ))}
      </div>
      <div className="button-container">
        <button className="verify-button" onClick={handleSubmit}>
          Verify OTP
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;
