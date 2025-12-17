import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosInstance from "../../services/api";

const Step2 = ({ formData, onNext, onBack, companyId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sameAddress, setSameAddress] = useState(
    formData.same_as_correspondence
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: formData,
  });

  const correspondenceData = watch([
    "correspondence_address1",
    "correspondence_address2",
    "correspondence_address3",
    "correspondence_country",
    "correspondence_state",
    "correspondence_city",
    "correspondence_pincode",
    "correspondence_phone",
    "correspondence_alternate_phone",
  ]);

  // Auto-fill billing address when same address is checked
  useEffect(() => {
    if (sameAddress) {
      const [
        address1,
        address2,
        address3,
        country,
        state,
        city,
        pincode,
        phone,
        altPhone,
      ] = correspondenceData;

      setValue("billing_address1", address1);
      setValue("billing_address2", address2);
      setValue("billing_address3", address3);
      setValue("billing_country", country);
      setValue("billing_state", state);
      setValue("billing_city", city);
      setValue("billing_pincode", pincode);
      setValue("billing_phone", phone);
      setValue("billing_alternate_phone", altPhone);
    }
  }, [sameAddress, correspondenceData, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/register/step2/${companyId}`,
        {
          ...data,
          same_as_correspondence: sameAddress,
        }
      );

      if (response.data.success) {
        onNext(data);
      } else {
        setError(response.data.message || "Step 2 failed");
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

  const indianStates = [
    "MAHARASHTRA",
    "DELHI",
    "KARNATAKA",
    "TAMIL NADU",
    "GUJARAT",
    "RAJASTHAN",
    "UTTAR PRADESH",
    "WEST BENGAL",
    "KERALA",
    "PUNJAB",
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        <span className="text-gray-400 mr-2">1 Login Details</span>
        <span className="text-blue-600">2 Address</span>
        <span className="text-gray-400 ml-2">3 Contact Details & Profile</span>
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Correspondence Address */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Correspondence Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 1*
              </label>
              <input
                type="text"
                {...register("correspondence_address1", {
                  required: "Address 1 is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.correspondence_address1
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="CHOTA MHASOBA ROAD"
              />
              {errors.correspondence_address1 && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.correspondence_address1.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 2*
              </label>
              <input
                type="text"
                {...register("correspondence_address2", {
                  required: "Address 2 is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.correspondence_address2
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="RUNALI BLDG F WING"
              />
              {errors.correspondence_address2 && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.correspondence_address2.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address 3
              </label>
              <input
                type="text"
                {...register("correspondence_address3")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Optional"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <input
                type="text"
                {...register("correspondence_country", {
                  required: "Country is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.correspondence_country
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value="INDIA"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                {...register("correspondence_state", {
                  required: "State is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.correspondence_state
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.correspondence_state && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.correspondence_state.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                {...register("correspondence_city", {
                  required: "City is required",
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.correspondence_city
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="KALYAN"
              />
              {errors.correspondence_city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.correspondence_city.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode *
              </label>
              <input
                type="text"
                {...register("correspondence_pincode", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Invalid pincode (6 digits)",
                  },
                })}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.correspondence_pincode
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="421301"
              />
              {errors.correspondence_pincode && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.correspondence_pincode.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <div className="flex">
                  <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                    <span className="text-gray-700">91</span>
                  </div>
                  <input
                    type="tel"
                    {...register("correspondence_phone", {
                      required: "Phone is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg ${
                      errors.correspondence_phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="9594515799"
                  />
                </div>
                {errors.correspondence_phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.correspondence_phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <div className="flex">
                  <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                    <span className="text-gray-700">91</span>
                  </div>
                  <input
                    type="tel"
                    {...register("correspondence_alternate_phone")}
                    className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                {...register("correspondence_website")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Billing Address
            </h3>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sameAddress}
                onChange={(e) => setSameAddress(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">
                Use the same company details from registration
              </span>
            </label>
          </div>

          {!sameAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Company Name *
                </label>
                <input
                  type="text"
                  {...register("billing_company_name", {
                    required:
                      !sameAddress && "Billing company name is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.billing_company_name
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="DASWDEAS"
                />
                {errors.billing_company_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billing_company_name.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 1*
                </label>
                <input
                  type="text"
                  {...register("billing_address1", {
                    required: !sameAddress && "Address 1 is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.billing_address1
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="CHOTA MHASOBA ROAD"
                />
                {errors.billing_address1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billing_address1.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 2*
                </label>
                <input
                  type="text"
                  {...register("billing_address2", {
                    required: !sameAddress && "Address 2 is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.billing_address2
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="RUNALI BLDG F WING"
                />
                {errors.billing_address2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billing_address2.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 3
                </label>
                <input
                  type="text"
                  {...register("billing_address3")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="KALYAN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  {...register("billing_country", {
                    required: !sameAddress && "Country is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.billing_country
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value="INDIA"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  {...register("billing_state", {
                    required: !sameAddress && "State is required",
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.billing_state ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.billing_state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billing_state.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  {...register("billing_city")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="KALYAN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  {...register("billing_pincode", {
                    required: !sameAddress && "Pincode is required",
                    pattern: {
                      value: /^[0-9]{6}$/,
                      message: "Invalid pincode",
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.billing_pincode
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="421301"
                />
                {errors.billing_pincode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billing_pincode.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <div className="flex">
                    <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                      <span className="text-gray-700">91</span>
                    </div>
                    <input
                      type="tel"
                      {...register("billing_phone", {
                        required: !sameAddress && "Phone is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className={`flex-1 px-4 py-3 border border-l-0 rounded-r-lg ${
                        errors.billing_phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="9594515799"
                    />
                  </div>
                  {errors.billing_phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.billing_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternate Phone
                  </label>
                  <div className="flex">
                    <div className="w-20 px-3 py-3 border border-gray-300 rounded-l-lg bg-gray-50 flex items-center">
                      <span className="text-gray-700">91</span>
                    </div>
                    <input
                      type="tel"
                      {...register("billing_alternate_phone")}
                      className="flex-1 px-4 py-3 border border-l-0 border-gray-300 rounded-r-lg"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GSTIN *
                </label>
                <input
                  type="text"
                  {...register("gstin", {
                    required: !sameAddress && "GSTIN is required",
                    pattern: {
                      value:
                        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                      message: "Format (27ABCDE1234F2Z5)",
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.gstin ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="27ABCDE1234F2Z4"
                />
                {errors.gstin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gstin.message}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Format (27ABCDE1234F2Z5)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN *
                </label>
                <input
                  type="text"
                  {...register("pan", {
                    required: !sameAddress && "PAN is required",
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Format (ABCDE1234F)",
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg ${
                    errors.pan ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ABCDE1234F"
                />
                {errors.pan && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.pan.message}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Format (ABCDE1234F)
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    {...register("gst_responsibility", {
                      required: "You must accept GST responsibility",
                    })}
                    className="h-4 w-4 text-blue-600 rounded mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I/We certify that the above named business is GST registered
                    and that I/We take full responsibility for the accuracy and
                    completeness of this statement. ECAMEX refuses to assume any
                    responsibility or accept any liability due to either
                    incomplete or inaccurate GST registration and disclosure.
                    <br />
                    <br />
                    Please note that ECAMEX will charge GST on all taxable
                    services at applicable rates in accordance with the
                    legislation of India in addition to the applicable tariff.
                  </span>
                </label>
                {errors.gst_responsibility && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.gst_responsibility.message}
                  </p>
                )}
              </div>
            </div>
          )}
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
            {loading ? "Processing..." : "Save & Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step2;
