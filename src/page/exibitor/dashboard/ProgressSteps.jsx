import React, { useEffect, useState } from "react";
import axiosInstance from "../../../services/api";

const ProgressSteps = () => {
  const [companyStalls, setCompanyStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchCompanyStalls();
    checkPaymentStatus();
  }, []);

  const fetchCompanyStalls = async () => {
    try {
      const response = await axiosInstance.get("/stalls/company");
      if (response.data.success) {
        setCompanyStalls(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching stalls:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = () => {
    const company = JSON.parse(localStorage.getItem("company") || "{}");
    const hasPayment = company.amount_paid && company.amount_paid > 0;
    setPaymentCompleted(hasPayment);
  };

  const handleDemoPayment = async () => {
    if (companyStalls.length === 0) {
      alert("Please book a stall first!");
      return;
    }

    setProcessingPayment(true);

    try {
      const stall = companyStalls[0];

      const response = await axiosInstance.post("/payments/process", {
        stall_number: stall.stall_number,
        amount: 29500,
      });

      if (response.data.success) {
        alert("Demo payment processed successfully!");

        const company = JSON.parse(localStorage.getItem("company") || "{}");
        company.amount_paid = (company.amount_paid || 0) + 29500;
        localStorage.setItem("company", JSON.stringify(company));

        setPaymentCompleted(true);

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Demo payment failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const hasBookedStall = companyStalls.length > 0;
  const isPaymentCurrent = hasBookedStall && !paymentCompleted;
  const isPaymentCompleted = hasBookedStall && paymentCompleted;

  const stepList = [
    {
      key: "registration",
      label: "Registration",
      icon: "✅",
      status: "completed",
      description: "Registration completed",
      number: 1,
    },
    {
      key: "stall_allotment",
      label: "Stall Allotment",
      icon: "🗺️",
      status: hasBookedStall ? "completed" : "current",
      description: hasBookedStall ? "Stall booked" : "Select stall",
      number: 2,
      showStallInfo: hasBookedStall,
    },
    {
      key: "advance_payment",
      label: "Payment",
      icon: "💳",
      status: isPaymentCompleted
        ? "completed"
        : isPaymentCurrent
        ? "current"
        : "pending",
      description: "Complete payment",
      number: 3,
      showPaymentButton: isPaymentCurrent && !processingPayment,
      showPaymentInfo: isPaymentCurrent || isPaymentCompleted,
      isPaymentCompleted: isPaymentCompleted,
    },
    {
      key: "payment_approval",
      label: "Approval",
      icon: "👨‍💼",
      status: isPaymentCompleted ? "current" : "pending",
      description: "Payment approval",
      number: 4,
    },
    {
      key: "book_services",
      label: "Services",
      icon: "🛠️",
      status: "pending",
      description: "Book services",
      number: 5,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const completedSteps = stepList.filter(
    (step) => step.status === "completed"
  ).length;
  const totalSteps = stepList.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200"></div>
        <div
          className="absolute top-4 left-0 h-1 bg-green-500 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {stepList.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";
            const isPending = step.status === "pending";

            return (
              <div
                key={step.key}
                className="flex flex-col items-center relative z-10"
              >
                {/* Step Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2
                    ${isCompleted ? "bg-green-500" : ""}
                    ${isCurrent ? "bg-blue-500 ring-4 ring-blue-200" : ""}
                    ${isPending ? "bg-gray-300" : ""}
                    transition-all duration-300
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span
                      className={`font-bold ${
                        isCurrent ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {step.number}
                    </span>
                  )}
                </div>

                {/* Step Label */}
                <div className="text-center max-w-[120px]">
                  <div className="flex items-center justify-center mb-1">
                    <span className="text-lg mr-1">{step.icon}</span>
                    <span
                      className={`
                      text-sm font-medium
                      ${isCompleted ? "text-green-700" : ""}
                      ${isCurrent ? "text-blue-700" : ""}
                      ${isPending ? "text-gray-500" : ""}
                    `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Done
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <svg
                          className="w-3 h-3 mr-1 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Step Description */}
                  <p className="text-xs text-gray-600 mb-2">
                    {step.description}
                  </p>

                  {/* Stall Info */}
                  {step.showStallInfo && companyStalls.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded p-2 mb-2">
                      <div className="flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-xs font-medium text-green-800">
                          Stall #{companyStalls[0].stall_number}
                        </span>
                      </div>
                      <p className="text-xs text-green-700 mt-1 text-center">
                        {companyStalls[0].hall_number}
                      </p>
                    </div>
                  )}

                  {/* Payment Info */}
                  {step.showPaymentInfo && (
                    <div
                      className={`p-2 rounded mb-2 ${
                        step.isPaymentCompleted
                          ? "bg-green-50 border border-green-200"
                          : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-1">
                        <span
                          className={`text-sm font-bold ${
                            step.isPaymentCompleted
                              ? "text-green-600"
                              : "text-blue-600"
                          }`}
                        >
                          ₹{step.isPaymentCompleted ? "29,500" : "29,500"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 text-center">
                        {step.isPaymentCompleted ? "Paid" : "Due"}
                      </p>
                    </div>
                  )}

                  {/* Payment Button */}
                  {step.showPaymentButton && (
                    <button
                      onClick={handleDemoPayment}
                      disabled={processingPayment}
                      className={`
                        w-full py-2 px-3 rounded-lg text-xs font-medium
                        ${
                          processingPayment
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        } text-white shadow-sm
                      `}
                    >
                      {processingPayment ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
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
                      ) : (
                        <span className="flex items-center justify-center">
                          <svg
                            className="w-3 h-3 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Pay Now
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-medium text-gray-700">
              Booking Progress
            </h4>
            <p className="text-xs text-gray-500">
              Complete all steps to finish booking
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-green-600">
              {completedSteps}/{totalSteps}
            </span>
            <p className="text-xs text-gray-500">Steps completed</p>
          </div>
        </div>

        {/* Progress Bar with Percentage */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span className="font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step Info */}
        {stepList.find((step) => step.status === "current") && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
              <div>
                <p className="text-xs font-medium text-gray-700">
                  Current Step:
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {stepList.find((step) => step.status === "current")?.label}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs font-medium text-gray-700 mb-2">Next Steps:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {stepList
              .filter((step) => step.status === "pending")
              .slice(0, 2)
              .map((step) => (
                <li key={step.key} className="flex items-center">
                  <svg
                    className="w-3 h-3 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  {step.label}
                </li>
              ))}
          </ul>
        </div>

        {/* Help Text */}
        <div className="mt-4 pt-3 border-t">
          <p className="text-xs text-gray-500 text-center">
            Click on each step for more details
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;

// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../../services/api";

// const ProgressSteps = () => {
//   const [companyStalls, setCompanyStalls] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchCompanyStalls();
//   }, []);

//   const fetchCompanyStalls = async () => {
//     try {
//       const response = await axiosInstance.get("/stalls/company");
//       if (response.data.success) {
//         setCompanyStalls(response.data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching stalls:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const hasBookedStall = companyStalls.length > 0;

//   const stepList = [
//     {
//       key: "registration",
//       label: "Registration",
//       icon: "✅",
//       status: "completed",
//     },
//     {
//       key: "stall_allotment",
//       label: "Stall Allotment",
//       icon: "🗺️",
//       status: hasBookedStall ? "completed" : "current",
//     },
//     {
//       key: "advance_payment",
//       label: "Payment",
//       icon: "💳",
//       status: "pending",
//     },
//     {
//       key: "payment_approval",
//       label: "Payment Approved",
//       icon: "👨‍💼",
//       status: "pending",
//     },
//   ];

//   return (
//     <div className="relative">
//       <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 -z-10"></div>

//       <div className="space-y-8">
//         {stepList.map((step, index) => {
//           const isCompleted = step.status === "completed";
//           const isCurrent = step.status === "current";

//           return (
//             <div key={step.key} className="flex items-start">
//               <div
//                 className={`
//                 w-8 h-8 rounded-full flex items-center justify-center mr-4
//                 ${
//                   isCompleted
//                     ? "bg-green-500"
//                     : isCurrent
//                     ? "bg-blue-500"
//                     : "bg-gray-300"
//                 }
//                 ${isCurrent ? "ring-4 ring-blue-200" : ""}
//               `}
//               >
//                 {isCompleted ? (
//                   <svg
//                     className="w-5 h-5 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 ) : (
//                   <span className="text-white font-bold">{index + 1}</span>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <div className="flex items-center">
//                   <span className="text-lg mr-2">{step.icon}</span>
//                   <h4
//                     className={`
//                     text-lg font-medium
//                     ${
//                       isCompleted
//                         ? "text-green-700"
//                         : isCurrent
//                         ? "text-blue-700"
//                         : "text-gray-500"
//                     }
//                   `}
//                   >
//                     {step.label}
//                   </h4>
//                 </div>

//                 <div className="mt-1">
//                   {isCompleted ? (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       Completed
//                     </span>
//                   ) : isCurrent ? (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                       In Progress
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                       Pending
//                     </span>
//                   )}
//                 </div>

//                 {step.key === "stall_allotment" && hasBookedStall && (
//                   <div className="mt-2 text-sm text-green-600">
//                     {companyStalls.map((stall) => (
//                       <div key={stall.id}>
//                         Booked: {stall.hall_number} - {stall.stall_number}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ProgressSteps;
