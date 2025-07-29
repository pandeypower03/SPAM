import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import { verifybutton, resendotpfrontend } from "../apis";

export default function Otp() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext); // Get setUser from context
  const location = useLocation();

  // Get user data from location state (passed from login) or context
  const currentUser = location.state?.user || user;
  const email = currentUser?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef([]);

  // Redirect if no user data
  useEffect(() => {
    if (!currentUser || !email) {
      navigate("/");
    }
  }, [currentUser, email, navigate]);

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (isExpired) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    setError("");
    setSuccess("");

    const otpCode = otp.join("");
    console.log("OTP Code:", otpCode);

    const result = await verifybutton({
      email: email, // Use email from state or context
      user: currentUser, // Use currentUser instead of user
      otp: otpCode,
    });

    if (result.success) {
      setSuccess("OTP verified successfully!");

      // NOW set the user in context after successful OTP verification
      setUser(currentUser);

      setTimeout(() => {
        navigate("/dashboard/");
      }, 1000);
    } else {
      setError(result.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    setError("");
    setSuccess("");

    console.log("Resending OTP...");
    console.log(email);

    const result = await resendotpfrontend({ email });

    if (result.success) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(60); // Reset timer
      setIsExpired(false);
      setSuccess("OTP sent successfully!");
      inputRefs.current[0]?.focus();
    } else {
      setError(result.message || "Failed to resend OTP");
    }
  };

  // Don't render if no user data
  if (!currentUser || !email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a 6-digit code to
            <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center space-x-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isExpired}
              className={`w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none transition-colors ${
                isExpired
                  ? "border-gray-200 bg-gray-100 text-gray-400"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
          ))}
        </div>

        {/* Timer */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            {isExpired ? (
              <span className="font-medium text-red-600">OTP Expired</span>
            ) : (
              <>
                Code expires in{" "}
                <span
                  className={`font-medium ${
                    timeLeft <= 10 ? "text-red-600" : "text-orange-600"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={otp.join("").length !== 6 || isExpired}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
        >
          {isExpired ? "OTP Expired" : "Verify Account"}
        </button>

        {/* Resend Option */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">
            {isExpired ? "OTP has expired." : "Didn't receive the code?"}
          </p>
          <button
            onClick={handleResend}
            className="text-blue-600 font-medium hover:text-blue-700 focus:outline-none"
          >
            {isExpired ? "Get New Code" : "Resend Code"}
          </button>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
