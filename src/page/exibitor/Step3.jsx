import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../services/api";
import { useNavigate } from "react-router-dom";

const Step3 = ({ formData, onNext, onBack, companyId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: formData,
  });

  const ownerEmail = watch("owner_email");
  const contactPersonName = watch("contact_person_name");

  const exhibitorCategories = [
    "Cables and Wires",
    "Accessories for Wiring",
    "Electrical Safety Equipments",
    "Stabilizers & UPS",
    "Switches and Switchgear",
    "Electrical Panels",
    "Lighting Solutions",
    "Energy Meters",
    "Transformers",
    "Generators",
    "Batteries",
    "Solar Products",
    "Motors and Drives",
    "Test and Measurement Equipment",
    "Automation Systems",
  ];

  // Auto-fill contact person name
  const handleOwnerNameChange = (e) => {
    setValue("contact_person_name", e.target.value);
  };

  // Auto-fill accountant details
  const handleUseSameDetails = (field) => {
    if (field === "contact_person") {
      setValue("contact_person_name", watch("owner_name"));
      setValue("contact_person_email", ownerEmail);
    }
    if (field === "accountant") {
      setValue("accountant_name", watch("owner_name"));
      setValue("accountant_email", ownerEmail);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/register/step3/${companyId}`,
        {
          ...data,
          owner_mobile: `91${data.owner_mobile}`,
          contact_person_mobile: `91${data.contact_person_mobile}`,
          accountant_mobile: `91${data.accountant_mobile}`,
        }
      );

      if (response.data.success) {
        // Redirect to login page
        navigate("/login", {
          state: {
            message:
              "Registration successful! Please login with your email and password.",
            email: data.owner_email || data.email,
          },
        });
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <span className="text-gray-400 mr-2">1 Login Details</span>
        <span className="text-gray-400 mr-2">2 Address</span>
        <span className="text-blue-600">3 Contact Details & Profile</span>
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Owner/CEO/MD Details */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Name Owner/CEO/MD *
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register("owner_name", {
                  required: "Owner name is required",
                })}
                onChange={handleOwnerNameChange}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.owner_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="YESMYFRIEND"
              />
              {errors.owner_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register("owner_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.owner_email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="SDFSF@GMAIL.COM"
              />
              {errors.owner_email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                {...register("owner_designation", {
                  required: "Designation is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.owner_designation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="SDFSD"
              />
              {errors.owner_designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_designation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile *
              </label>
              <div className="flex">
                <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                  <span className="text-gray-700">91</span>
                </div>
                <input
                  type="tel"
                  {...register("owner_mobile", {
                    required: "Mobile is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg ${
                    errors.owner_mobile ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="9594515799"
                />
              </div>
              {errors.owner_mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.owner_mobile.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Person Details */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Name of Contact Person (for Booking) *
            </h3>
            <button
              type="button"
              onClick={() => handleUseSameDetails("contact_person")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Use same details as above
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register("contact_person_name", {
                  required: "Contact person name is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.contact_person_name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="YESMYFRIEND"
              />
              {errors.contact_person_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact_person_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register("contact_person_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.contact_person_email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="SDFSF32@GMAIL.COM"
              />
              {errors.contact_person_email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact_person_email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                {...register("contact_person_designation", {
                  required: "Designation is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.contact_person_designation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="SDFSD"
              />
              {errors.contact_person_designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact_person_designation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile *
              </label>
              <div className="flex">
                <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                  <span className="text-gray-700">91</span>
                </div>
                <input
                  type="tel"
                  {...register("contact_person_mobile", {
                    required: "Mobile is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg ${
                    errors.contact_person_mobile
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="9594515799"
                />
              </div>
              {errors.contact_person_mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contact_person_mobile.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Accountant Details */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Name of Accountant (for Billing) *
            </h3>
            <button
              type="button"
              onClick={() => handleUseSameDetails("accountant")}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Use same details as above
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                {...register("accountant_name", {
                  required: "Accountant name is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.accountant_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="YESMYFRIEND"
              />
              {errors.accountant_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountant_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                {...register("accountant_email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.accountant_email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="SDFSF3@GMAIL.COM"
              />
              {errors.accountant_email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountant_email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                {...register("accountant_designation", {
                  required: "Designation is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.accountant_designation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="SDFSD"
              />
              {errors.accountant_designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountant_designation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile *
              </label>
              <div className="flex">
                <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                  <span className="text-gray-700">91</span>
                </div>
                <input
                  type="tel"
                  {...register("accountant_mobile", {
                    required: "Mobile is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Invalid mobile number",
                    },
                  })}
                  className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg ${
                    errors.accountant_mobile
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="9594515799"
                />
              </div>
              {errors.accountant_mobile && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountant_mobile.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Exhibitor Profile */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Exhibitor Profile *
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select categories (Select at least one) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {exhibitorCategories.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={category}
                    {...register("exhibitor_profile", {
                      required: "Select at least one category",
                    })}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
            {errors.exhibitor_profile && (
              <p className="text-red-500 text-sm mt-2">
                {errors.exhibitor_profile.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name of overseas principals represented
            </label>
            <input
              type="text"
              {...register("overseas_principals")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Enter overseas principals if any"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Profile *
            </label>
            <textarea
              {...register("company_profile", {
                required: "Company profile is required",
                minLength: {
                  value: 20,
                  message: "Minimum 20 characters required",
                },
              })}
              rows="4"
              className={`w-full px-4 py-3 border rounded-lg ${
                errors.company_profile ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe your company profile..."
            />
            {errors.company_profile && (
              <p className="text-red-500 text-sm mt-1">
                {errors.company_profile.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referred By
            </label>
            <input
              type="text"
              {...register("referred_by")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              placeholder="Website / Other source"
            />
          </div>
        </div>

        {/* Authorization */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="mb-6">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                {...register("accept_terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="h-4 w-4 text-blue-600 rounded mt-1"
              />
              <span className="text-sm text-gray-700">
                We confirm our participation at ECAMEX. We have read and
                understood the Rules and Regulations and also accept those which
                will be established from time to time, which will also form part
                of this contract.
                <br />
                <br />
                Disclaimer: As organisers we believe the person filling this
                form is the authorized person from his/her company and ECAMEX
                shall not be held liable for any erroneous representation of
                facts mentioned in the form.
              </span>
            </label>
            {errors.accept_terms && (
              <p className="text-red-500 text-sm mt-2">
                {errors.accept_terms.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name of authorized person *
              </label>
              <input
                type="text"
                {...register("authorized_person_name", {
                  required: "Authorized person name is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.authorized_person_name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="ASDSAD"
              />
              {errors.authorized_person_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.authorized_person_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <input
                type="text"
                {...register("authorized_person_designation", {
                  required: "Designation is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.authorized_person_designation
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="SADSADSAD"
              />
              {errors.authorized_person_designation && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.authorized_person_designation.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Complete Registration"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3;
