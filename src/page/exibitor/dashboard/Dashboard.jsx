import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../services/api";
import ProgressSteps from "./ProgressSteps";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const company = localStorage.getItem("company");

    if (!token || !company) {
      navigate("/login");
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/dashboard");

      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || "Failed to load dashboard");
      }
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      setError(error.response?.data?.message || "Error loading dashboard data");

      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("company");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("company");
      delete axiosInstance.defaults.headers.common["Authorization"];
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Login Again
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            No Data Available
          </h2>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Load Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { company = {}, event = {}, booking_steps = {} } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 pt-25">
      <div className="bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {event.name || "ECAMEX26"}
              </h1>
              <p className="text-xl mb-1">
                {event.theme || "ELECTRICAL SAFETY & RENEWABLE ENERGY"}
              </p>
              <p className="text-blue-200">
                {event.description ||
                  "A Grand 3 Day Electrical Industry Exhibition"}
              </p>
            </div>
            <div className="text-center md:text-right">
              <div className="mb-3">
                <span className="text-lg font-bold">
                  {company.company_name || company.name || "Company Name"}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Booking Steps
              </h3>
              <ProgressSteps />

              <div className="mt-8 pt-6 border-t">
                <h4 className="text-lg font-bold text-gray-700 mb-4">
                  Next Step: Select Your Stall
                </h4>
                <p className="text-gray-600 mb-4">
                  Click below to view hall layout and select your stall
                </p>
                <Link
                  to="/hall-layout"
                  className="inline-flex items-center px-6 py-3 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg transition"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  View Hall Layout & Select Stall
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                to="/company/details"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
              >
                <div className="text-2xl mb-2">📄</div>
                <span className="font-medium text-gray-700">
                  Company Details
                </span>
              </Link>

              <Link
                to="/hall-layout"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
              >
                <div className="text-2xl mb-2">🗺️</div>
                <span className="font-medium text-gray-700">Stall Booking</span>
              </Link>

              <Link
                to="/invoices"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
              >
                <div className="text-2xl mb-2">🧾</div>
                <span className="font-medium text-gray-700">INVOICE</span>
              </Link>

              <Link
                to="/payment"
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
              >
                <div className="text-2xl mb-2">💳</div>
                <span className="font-medium text-gray-700">Payments</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
