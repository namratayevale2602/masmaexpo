import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/api";

const PaymentDetails = () => {
  const { stallNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [booked, setBooked] = useState(false);
  const [paymentSchedule, setPaymentSchedule] = useState(null);

  useEffect(() => {
    fetchPaymentSchedule();
    checkIfStallBooked();
  }, [stallNumber]);

  const fetchPaymentSchedule = async () => {
    try {
      const response = await axiosInstance.get("/payments/schedule");
      if (response.data.success) {
        setPaymentSchedule(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching payment schedule:", error);
    }
  };

  const checkIfStallBooked = async () => {
    try {
      const response = await axiosInstance.get("/stalls/company");
      if (response.data.success) {
        const hasStall = response.data.data.some(
          (stall) => stall.stall_number === stallNumber
        );
        setBooked(hasStall);
      }
    } catch (error) {
      console.error("Error checking stall:", error);
    }
  };

  const handleBookStall = async () => {
    setProcessing(true);

    try {
      // First, allocate the stall
      const allocationResponse = await axiosInstance.post("/stalls/allocate", {
        stall_number: stallNumber,
        hall_number: "Hall 2",
      });

      if (allocationResponse.data.success) {
        // Then process payment (demo)
        const paymentResponse = await axiosInstance.post("/payments/process", {
          stall_number: stallNumber,
          amount: 29500,
        });

        if (paymentResponse.data.success) {
          alert(`Stall #${stallNumber} booked successfully!`);
          setBooked(true);

          setTimeout(() => {
            navigate("/hall-layout");
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert(
        error.response?.data?.message ||
          "Failed to book stall. Please try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitPayment = async () => {
    setProcessing(true);

    try {
      const response = await axiosInstance.post("/payments/process", {
        stall_number: stallNumber,
        amount: 29500,
      });

      if (response.data.success) {
        alert("Payment processed successfully (Demo)");
        setTimeout(() => {
          navigate("/hall-layout");
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!paymentSchedule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <nav className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800"
          >
            Dashboard
          </button>
          <span className="mx-2">›</span>
          <button
            onClick={() => navigate("/hall-layout")}
            className="text-blue-600 hover:text-blue-800"
          >
            Hall Layout
          </button>
          <span className="mx-2">›</span>
          <span className="font-semibold text-gray-700">
            {booked ? "Payment" : "Book Stall"} #{stallNumber}
          </span>
        </nav>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              {booked ? "Payment Details" : "Book Your Stall"}
            </h1>
            <p className="text-blue-200">Stall #{stallNumber} • Hall 2</p>
          </div>

          <div className="p-6">
            {/* Stall Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Stall Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Stall Number:</span>
                  <div className="text-xl font-bold text-blue-600">
                    #{stallNumber}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Hall:</span>
                  <div className="text-lg font-medium">Hall 2</div>
                </div>
                <div>
                  <span className="text-gray-600">Size:</span>
                  <div className="text-lg font-medium">3x3 meters</div>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      booked
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {booked ? "Booked" : "Available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-4">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Stall Booking Fee:</span>
                  <span className="font-bold">₹25,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit:</span>
                  <span>₹4,500</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-bold text-xl text-green-600">
                    ₹29,500
                  </span>
                </div>
              </div>
            </div>

            {/* Demo Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Demo Mode:</span>
                    {booked
                      ? " This stall is already booked. You can process payment to complete the booking."
                      : " Click 'Book & Pay Now' to simulate booking. In production, this would redirect to a payment gateway."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/hall-layout")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={processing}
              >
                {booked ? "Back to Layout" : "Cancel"}
              </button>
              <button
                onClick={booked ? handleSubmitPayment : handleBookStall}
                disabled={processing}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold ${
                  processing
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                } text-white`}
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : booked ? (
                  "Complete Payment (Demo)"
                ) : (
                  "Book & Pay Now (Demo)"
                )}
              </button>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t text-center text-gray-500 text-sm">
            ECAMEX26 • Stall Booking System • Demo Version
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
