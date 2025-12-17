import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../services/api";

const Step1 = ({ formData, onNext, setCompanyId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: formData,
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/register/step1", data);

      if (response.data.success) {
        setCompanyId(response.data.company_id);
        onNext(data);
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      if (err.response?.data?.errors) {
        console.error("Validation errors:", err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">1 Login Details</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <input
            type="text"
            {...register("company_name", {
              required: "Company name is required",
              minLength: { value: 2, message: "Minimum 2 characters required" },
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.company_name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your company name"
          />
          {errors.company_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.company_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Create Password *
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Minimum 8 characters required" },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@&#])[A-Za-z\d@&#]{8,}$/,
                message:
                  "Password must contain uppercase, lowercase, number, and special character (@, &, #)",
              },
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Abc@2345"
          />
          {errors.password ? (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          ) : (
            <p className="text-gray-500 text-sm mt-1">
              Characters allowed [a-zA-Z0-9 @ & #] Format (Abc@2345)
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter your Email ID *
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="company@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Re-Enter Password *
          </label>
          <input
            type="password"
            {...register("confirm_password", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.confirm_password ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Re-enter password"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {loading ? (
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
            ) : (
              "Save & Next"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;
