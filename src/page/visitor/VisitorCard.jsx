import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStickyNote,
  FaWhatsapp,
  FaPhoneAlt,
  FaCheckCircle,
  FaPrint,
  FaCopy,
  FaQrcode,
  FaIdCard,
  FaHome,
  FaCity,
  FaBuilding,
  FaArrowLeft,
  FaWifi,
  FaMobileAlt,
  FaDesktop,
  FaExternalLinkAlt,
} from "react-icons/fa";

const VisitorCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [networkInfo, setNetworkInfo] = useState({
    ip: "192.168.1.38",
    port: "5173",
    accessible: false,
  });

  // Check network accessibility
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        const response = await fetch(`https://masmaexpo.vercel.app`);
        setNetworkInfo((prev) => ({ ...prev, accessible: response.ok }));
      } catch (err) {
        console.log("Mobile network not accessible from this device");
      }
    };

    checkNetwork();
  }, []);

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        setLoading(true);
        console.log("Fetching visitor with ID:", id);

        // Try multiple endpoints
        const endpoints = [
          `https://masmaexpo.demovoting.com/api/visitors/${id}`,
        ];

        let response = null;
        let visitorData = null;

        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            response = await axios.get(endpoint, { timeout: 5000 });
            console.log("API Response:", response.data);

            // Check different response formats
            if (response.data && response.data.success && response.data.data) {
              // Format 1: { success: true, data: {...} }
              visitorData = response.data.data;
              console.log("Found data in response.data.data:", visitorData);
              break;
            } else if (response.data && response.data.visitor_name) {
              // Format 2: Direct visitor object
              visitorData = response.data;
              console.log("Found direct visitor object:", visitorData);
              break;
            } else if (response.data) {
              // Format 3: Maybe data is directly in response.data
              visitorData = response.data;
              console.log("Using response.data directly:", visitorData);
              break;
            }
          } catch (err) {
            console.log(`Failed to fetch from ${endpoint}:`, err.message);
            if (err.response?.status === 404) {
              setError(`Visitor with ID ${id} not found in the database.`);
              setLoading(false);
              return;
            }
          }
        }

        if (visitorData) {
          console.log("Setting visitor state:", visitorData);
          setVisitor(visitorData);
        } else {
          console.log("No visitor data found in response");
          setError(
            "Visitor data not found in response. Please check the API response format."
          );
        }
      } catch (err) {
        console.error("Error fetching visitor:", err);
        setError(`Failed to load visitor: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVisitor();
    } else {
      setError("No visitor ID provided");
      setLoading(false);
    }
  }, [id]);

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  };

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // const generateQRCodeUrl = () => {
  //   if (visitor?.qr_code_url) return visitor.qr_code_url;

  //   // Generate QR code with current URL
  //   const currentUrl = window.location.href;
  //   return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
  //     currentUrl
  //   )}`;
  // };

  // Network status component
  const NetworkStatus = () => (
    <div className="fixed top-4 right-4 z-50 print:hidden">
      <div
        className={`flex items-center px-3 py-2 rounded-lg ${
          networkInfo.accessible
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        <FaWifi
          className={`mr-2 ${
            networkInfo.accessible ? "text-green-600" : "text-yellow-600"
          }`}
        />
        <span className="text-sm font-medium">
          {networkInfo.accessible ? "Mobile Accessible" : "Local Only"}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading visitor #{id}...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching from API...</p>
        </div>
      </div>
    );
  }

  if (error || !visitor) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <NetworkStatus />
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-6">
            <FaIdCard className="mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Visitor Not Found
          </h1>
          <p className="text-gray-600 mb-4 whitespace-pre-line">{error}</p>

          <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">
              Debug Information:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Visitor ID: {id}</li>
              <li>
                • API Endpoint: https://masmaexpo.demovoting.com/api/visitors/
                {id}
              </li>
              <li>• Frontend URL: {window.location.href}</li>
              <li>• Data received: {visitor ? "Yes" : "No"}</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-linear-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering visitor card with data:", visitor);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 p-4 md:p-8">
      <NetworkStatus />

      {/* Network Info Banner */}
      {!networkInfo.accessible && (
        <div className="max-w-4xl mx-auto mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 print:hidden">
          <div className="flex items-center">
            <FaMobileAlt className="text-yellow-600 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-800">
                Mobile Access Required
              </h3>
              <p className="text-sm text-yellow-700">
                For QR code scanning on mobile, access this page via: <br />
                <code className="bg-yellow-100 px-2 py-1 rounded text-xs mt-1">
                  https://masmaexpo.vercel.app/visitor/{id}/card
                </code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Print Button */}
      <button
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 bg-white text-blue-600 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50 print:hidden"
        title="Print ID Card"
      >
        <FaPrint size={24} />
      </button>

      <div className="max-w-4xl mx-auto pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Visitor ID Card
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Card Header */}
          <div className="relative bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 p-8 md:p-10 text-white">
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3">
              <FaIdCard size={24} />
            </div>

            <div className="flex flex-col md:flex-row items-center">
              {/* Avatar/Initials */}
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 md:mb-0 md:mr-8 border-4 border-white/30">
                <span className="text-4xl font-bold text-white">
                  {getInitials(visitor.visitor_name)}
                </span>
              </div>

              {/* Basic Info */}
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">
                  {visitor.visitor_name || "No Name"}
                </h2>
                {visitor.bussiness_name && (
                  <p className="text-lg opacity-90 mb-1">
                    {visitor.bussiness_name}
                  </p>
                )}
                <p className="opacity-80">
                  Visitor ID: VIS-
                  {visitor.id?.toString().padStart(6, "0") || "000000"}
                </p>

                {/* Status Badge */}
                <div className="inline-flex items-center mt-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <FaCheckCircle className="mr-2" />
                  <span className="font-semibold">Valid Visitor</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Contact Information
                </h3>

                <div className="space-y-4">
                  {/* Email */}
                  <InfoField
                    icon={<FaEnvelope />}
                    label="Email"
                    value={visitor.email}
                    onCopy={() => copyToClipboard(visitor.email, "email")}
                    copied={copiedField === "email"}
                  />

                  {/* Mobile */}
                  <InfoField
                    icon={<FaPhone />}
                    label="Mobile"
                    value={visitor.mobile}
                    onCopy={() => copyToClipboard(visitor.mobile, "mobile")}
                    copied={copiedField === "mobile"}
                  />

                  {/* Phone */}
                  {visitor.phone && (
                    <InfoField
                      icon={<FaPhoneAlt />}
                      label="Phone"
                      value={visitor.phone}
                      onCopy={() => copyToClipboard(visitor.phone, "phone")}
                      copied={copiedField === "phone"}
                    />
                  )}

                  {/* WhatsApp */}
                  {visitor.whatsapp_no && (
                    <InfoField
                      icon={<FaWhatsapp />}
                      label="WhatsApp"
                      value={visitor.whatsapp_no}
                      onCopy={() =>
                        copyToClipboard(visitor.whatsapp_no, "whatsapp")
                      }
                      copied={copiedField === "whatsapp"}
                    />
                  )}
                </div>
              </div>

              {/* Right Column - Additional Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Additional Information
                </h3>

                <div className="space-y-4">
                  {/* Address Fields */}
                  {visitor.city && (
                    <InfoField
                      icon={<FaCity />}
                      label="City"
                      value={visitor.city}
                    />
                  )}

                  {visitor.town && (
                    <InfoField
                      icon={<FaBuilding />}
                      label="Town"
                      value={visitor.town}
                    />
                  )}

                  {visitor.village && (
                    <InfoField
                      icon={<FaHome />}
                      label="Village"
                      value={visitor.village}
                    />
                  )}

                  {/* Registration Date */}
                  <InfoField
                    icon={<FaCalendarAlt />}
                    label="Registration Date"
                    value={formatDate(visitor.created_at)}
                  />

                  {/* Remarks */}
                  {visitor.remark && (
                    <InfoField
                      icon={<FaStickyNote />}
                      label="Remarks"
                      value={visitor.remark}
                      multiline
                    />
                  )}
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            {/* <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="mb-6 md:mb-0 md:mr-8 text-center">
                    <div className="relative inline-block">
                      <div className="w-48 h-48 bg-white p-4 rounded-2xl shadow-lg">
                        <img
                          src={generateQRCodeUrl()}
                          alt="Visitor QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                        SCAN ME
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable InfoField Component
const InfoField = ({
  icon,
  label,
  value,
  onCopy,
  copied,
  multiline = false,
}) => (
  <div className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
    <div className="text-blue-600 mt-1 mr-3">{icon}</div>
    <div className="flex-1">
      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        {label}
      </div>
      {multiline ? (
        <p className="text-gray-800 whitespace-pre-wrap">{value}</p>
      ) : (
        <p className="text-gray-800 font-medium">{value}</p>
      )}
    </div>
    {onCopy && (
      <button
        onClick={onCopy}
        className="ml-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
        title="Copy to clipboard"
      >
        {copied ? <FaCheckCircle className="text-green-500" /> : <FaCopy />}
      </button>
    )}
  </div>
);

export default VisitorCard;
