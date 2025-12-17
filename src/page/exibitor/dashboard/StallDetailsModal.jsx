import React, { useState } from "react";

const StallDetailsModal = ({ isOpen, onClose, stallData, onBook }) => {
  const [paymentMethod, setPaymentMethod] = useState("online");

  if (!isOpen || !stallData) return null;

  const { stall, user_booking, additional_info } = stallData;
  const remainingAmount = additional_info?.remaining_amount || stall.price;
  const paidAmount = user_booking?.paid_amount || 0;

  // Get open sides array
  const getOpenSidesArray = () => {
    if (Array.isArray(stall.open_sides)) {
      return stall.open_sides;
    }

    // Fallback for old data structure
    if (
      stall.open_side_top ||
      stall.open_side_right ||
      stall.open_side_bottom ||
      stall.open_side_left
    ) {
      const sides = [];
      if (stall.open_side_top) sides.push("top");
      if (stall.open_side_right) sides.push("right");
      if (stall.open_side_bottom) sides.push("bottom");
      if (stall.open_side_left) sides.push("left");
      return sides;
    }

    // Default
    return ["top", "right", "bottom"];
  };

  const openSides = getOpenSidesArray();
  const openSidesCount = stall.open_sides_count || openSides.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Stall Details</h2>
            <p className="text-gray-600">
              Complete information about the stall
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Stall Info */}
            <div>
              {/* Stall Header */}
              <div className="mb-6">
                <div className="text-3xl font-bold text-blue-600 mb-2 flex items-center gap-3">
                  Stall {stall.stall_number}
                  {stall.premium_floor && (
                    <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Hall {stall.hall_number}
                </div>
              </div>

              {/* Stall Specifications */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Scheme" value={stall.scheme} />
                  <InfoItem
                    label="Open Sides"
                    value={`${openSidesCount} Sides`}
                  />
                  <InfoItem label="Area" value={`${stall.area} Sqm`} />
                  <InfoItem label="Dimension" value={stall.dimension} />
                  <InfoItem
                    label="Premium Floor"
                    value={stall.premium_floor ? "Yes" : "No"}
                    valueClass={stall.premium_floor ? "text-green-600" : ""}
                  />
                  <InfoItem label="Size" value={stall.size} />
                  <InfoItem
                    label="Status"
                    value={stall.status}
                    valueClass={
                      stall.status === "available"
                        ? "text-green-600"
                        : stall.status === "booked"
                        ? "text-red-600"
                        : "text-gray-600"
                    }
                  />
                </div>

                {/* Open Sides Visualization */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Open Sides Visualization
                  </h4>
                  <div className="relative w-64 h-48 border-4 border-gray-300 mx-auto rounded-lg">
                    {/* Stall representation */}
                    <div className="absolute inset-6 bg-blue-50 flex flex-col items-center justify-center rounded">
                      <span className="text-2xl font-bold text-blue-700">
                        {stall.stall_number}
                      </span>
                      <span className="text-sm text-gray-600 mt-1">
                        {stall.hall_number}
                      </span>
                    </div>

                    {/* Open sides indicators with labels */}
                    {openSides.includes("top") && (
                      <>
                        <div className="absolute -top-2 left-1/3 right-1/3 h-2 bg-green-500 rounded-t"></div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                          <div className="flex flex-col items-center">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-green-500"></div>
                            <span className="text-xs text-green-600 font-medium mt-1">
                              Top
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {openSides.includes("right") && (
                      <>
                        <div className="absolute -right-2 top-1/3 bottom-1/3 w-2 bg-green-500 rounded-r"></div>
                        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center">
                            <span className="text-xs text-green-600 font-medium mr-1">
                              Right
                            </span>
                            <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-green-500"></div>
                          </div>
                        </div>
                      </>
                    )}

                    {openSides.includes("bottom") && (
                      <>
                        <div className="absolute -bottom-2 left-1/3 right-1/3 h-2 bg-green-500 rounded-b"></div>
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-green-600 font-medium mb-1">
                              Bottom
                            </span>
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500"></div>
                          </div>
                        </div>
                      </>
                    )}

                    {openSides.includes("left") && (
                      <>
                        <div className="absolute -left-2 top-1/3 bottom-1/3 w-2 bg-green-500 rounded-l"></div>
                        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2">
                          <div className="flex items-center">
                            <div className="w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-green-500"></div>
                            <span className="text-xs text-green-600 font-medium ml-1">
                              Left
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Closed sides indicators */}
                    {!openSides.includes("top") && (
                      <div className="absolute -top-2 left-1/3 right-1/3 h-2 bg-gray-400 rounded-t"></div>
                    )}

                    {!openSides.includes("right") && (
                      <div className="absolute -right-2 top-1/3 bottom-1/3 w-2 bg-gray-400 rounded-r"></div>
                    )}

                    {!openSides.includes("bottom") && (
                      <div className="absolute -bottom-2 left-1/3 right-1/3 h-2 bg-gray-400 rounded-b"></div>
                    )}

                    {!openSides.includes("left") && (
                      <div className="absolute -left-2 top-1/3 bottom-1/3 w-2 bg-gray-400 rounded-l"></div>
                    )}
                  </div>

                  {/* Open sides list */}
                  <div className="mt-4 text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      Open Sides:
                    </div>
                    <div className="flex justify-center gap-2">
                      {["top", "right", "bottom", "left"].map((side) => (
                        <span
                          key={side}
                          className={`px-3 py-1 rounded-full text-sm ${
                            openSides.includes(side)
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-gray-100 text-gray-500 border border-gray-300"
                          }`}
                        >
                          {side.charAt(0).toUpperCase() + side.slice(1)}
                          {openSides.includes(side) ? " ✓" : " ✗"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Booking Information
              </h3>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Stall Price</span>
                  <span className="text-lg font-bold">
                    ₹{parseFloat(stall.price).toLocaleString()}
                  </span>
                </div>

                {stall.premium_floor && (
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="text-gray-600">Premium Floor Charge</span>
                    <span className="text-yellow-600 font-bold">+ ₹50,000</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Security Deposit (20%)</span>
                  <span className="text-blue-600 font-bold">
                    ₹{(stall.price * 0.2).toLocaleString()}
                  </span>
                </div>

                {paidAmount > 0 && (
                  <>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Already Paid</span>
                      <span className="text-green-600 font-bold">
                        ₹{paidAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span className="text-gray-600">Remaining Amount</span>
                      <span className="text-blue-600 font-bold text-xl">
                        ₹{remainingAmount.toLocaleString()}
                      </span>
                    </div>
                  </>
                )}

                {paidAmount === 0 && (
                  <div className="text-center py-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ₹{remainingAmount.toLocaleString()}
                    </div>
                    <div className="text-gray-500">Total Booking Amount</div>
                    <div className="text-sm text-gray-400 mt-1">
                      (Including security deposit)
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-3">
                  Payment Method
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "online", label: "Online Payment" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                    { value: "cheque", label: "Cheque" },
                    { value: "card", label: "Credit/Debit Card" },
                  ].map((method) => (
                    <button
                      key={method.value}
                      onClick={() => setPaymentMethod(method.value)}
                      className={`px-4 py-3 rounded-lg border-2 text-center transition-colors ${
                        paymentMethod === method.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onBook(stall.id, paymentMethod)}
                  disabled={stall.status !== "available"}
                  className={`w-full py-4 rounded-lg font-bold text-lg transition-colors ${
                    stall.status === "available"
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {stall.status === "available"
                    ? `Book Stall ${stall.stall_number}`
                    : "Already Booked"}
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-sm text-gray-500">
                <p className="mb-2 font-medium">📋 Terms & Conditions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    20% security deposit required for booking confirmation
                  </li>
                  <li>Balance payment due 15 days before event</li>
                  <li>Premium floor charges are non-refundable</li>
                  <li>
                    Cancellation policy: 50% refund up to 30 days before event
                  </li>
                  <li>All prices are exclusive of GST @18%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for info items
const InfoItem = ({ label, value, valueClass = "" }) => (
  <div>
    <div className="text-sm text-gray-500 mb-1">{label}</div>
    <div className={`font-semibold ${valueClass}`}>{value}</div>
  </div>
);

export default StallDetailsModal;
