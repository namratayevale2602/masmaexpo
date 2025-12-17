import React from "react";

const ProgressBar = ({ currentStep, steps }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${
                  currentStep === step.number
                    ? "bg-blue-600 text-white"
                    : currentStep > step.number
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }
                font-bold
              `}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-5 h-5"
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
                  step.number
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep === step.number
                    ? "text-blue-600"
                    : currentStep > step.number
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connecting Line (except for last step) */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
