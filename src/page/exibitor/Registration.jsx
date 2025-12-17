import React, { useState } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ProgressBar from "./ProgressBar";

const Registration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [companyId, setCompanyId] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1
    company_name: "",
    email: "",
    password: "",
    confirm_password: "",

    // Step 2
    correspondence_address1: "",
    correspondence_address2: "",
    correspondence_address3: "",
    correspondence_country: "INDIA",
    correspondence_state: "",
    correspondence_city: "",
    correspondence_pincode: "",
    correspondence_phone: "",
    correspondence_alternate_phone: "",
    correspondence_website: "",
    same_as_correspondence: true,
    billing_company_name: "",
    billing_address1: "",
    billing_address2: "",
    billing_address3: "",
    billing_country: "INDIA",
    billing_state: "",
    billing_city: "",
    billing_pincode: "",
    billing_phone: "",
    billing_alternate_phone: "",
    gstin: "",
    pan: "",
    gst_responsibility: false,

    // Step 3
    owner_name: "",
    owner_email: "",
    owner_designation: "",
    owner_mobile: "",
    contact_person_name: "",
    contact_person_email: "",
    contact_person_designation: "",
    contact_person_mobile: "",
    accountant_name: "",
    accountant_email: "",
    accountant_designation: "",
    accountant_mobile: "",
    overseas_principals: "",
    exhibitor_profile: [],
    company_profile: "",
    referred_by: "",
    authorized_person_name: "",
    authorized_person_designation: "",
    accept_terms: false,
  });

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCompanyId = (id) => {
    setCompanyId(id);
  };

  const steps = [
    { number: 1, title: "Login Details" },
    { number: 2, title: "Address" },
    { number: 3, title: "Contact Details & Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-40">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            ECAMEX - Company Registration
          </h1>
          <p className="text-gray-600 mt-2">
            Register your company to participate in the exhibition
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} steps={steps} />

        {/* Form Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          {currentStep === 1 && (
            <Step1
              formData={formData}
              onNext={handleNext}
              setCompanyId={handleCompanyId}
            />
          )}

          {currentStep === 2 && (
            <Step2
              formData={formData}
              onNext={handleNext}
              onBack={handleBack}
              companyId={companyId}
            />
          )}

          {currentStep === 3 && (
            <Step3
              formData={formData}
              onNext={handleNext}
              onBack={handleBack}
              companyId={companyId}
            />
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* indicates mandatory fields</p>
          <p className="mt-1">
            Note: To complete your registration, fill all mandatory details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
