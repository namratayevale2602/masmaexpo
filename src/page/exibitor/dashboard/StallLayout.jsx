import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/api";
import StallDetailsModal from "./StallDetailsModal";
import HallGrid from "./HallGrid";

const HallLayout = () => {
  const [selectedStall, setSelectedStall] = useState(null);
  const [stalls, setStalls] = useState([]);
  const [companyStalls, setCompanyStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [halls, setHalls] = useState({});
  const [bookedStalls, setBookedStalls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLayoutData();
    fetchCompanyStalls();
  }, []);

  const fetchLayoutData = async () => {
    try {
      const response = await axiosInstance.get("/stalls/layout");
      if (response.data.success) {
        setHalls(response.data.data.halls);
        setStalls(response.data.data.halls["Hall 2"] || []);
        setBookedStalls(response.data.data.booked_stalls || []);
      }
    } catch (error) {
      console.error("Error fetching layout:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyStalls = async () => {
    try {
      const response = await axiosInstance.get("/stalls/company");
      if (response.data.success) {
        setCompanyStalls(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching company stalls:", error);
    }
  };

  const handleStallClick = async (stallNumber) => {
    try {
      const response = await axiosInstance.get(`/stalls/${stallNumber}`);
      if (response.data.success) {
        setSelectedStall(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stall details:", error);
    }
  };

  const handleBookStall = async (stallId, paymentMethod) => {
    try {
      // Note: stallId here should be the stall number like "C-01"
      const response = await axiosInstance.post("/stalls/allocate", {
        stall_number: stallId,
        hall_number: "Hall 2",
        payment_method: paymentMethod,
      });

      if (response.data.success) {
        alert("Stall booked successfully!");
        setSelectedStall(null);
        fetchLayoutData();
        fetchCompanyStalls();
      }
    } catch (error) {
      console.error("Error booking stall:", error);
      alert(error.response?.data?.message || "Failed to book stall");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-40">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Exhibition Hall Layout
              </h1>
              <p className="text-gray-600 mt-2">
                Select your preferred stall location
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Hall Selection Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b">
            {Object.keys(halls).map((hallName) => (
              <button
                key={hallName}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  hallName === "Hall 2"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {hallName}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Hall Grid */}
          <HallGrid
            stalls={stalls}
            companyStalls={companyStalls}
            bookedStalls={bookedStalls}
            onStallClick={handleStallClick}
          />

          {/* Legend */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Stall Status Legend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-100 border-2 border-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">Your Stall</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 border-2 border-gray-400 rounded"></div>
                <span className="text-sm text-gray-700">Booked</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded flex items-center justify-center">
                  <span className="text-xs">✕</span>
                </div>
                <span className="text-sm text-gray-700">Unavailable</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-400 rounded flex items-center justify-center">
                  <span className="text-xs text-blue-600">→</span>
                </div>
                <span className="text-sm text-gray-700">Open Side</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stall Details Modal */}
      <StallDetailsModal
        isOpen={!!selectedStall}
        onClose={() => setSelectedStall(null)}
        stallData={selectedStall}
        onBook={handleBookStall}
      />
    </div>
  );
};

export default HallLayout;
