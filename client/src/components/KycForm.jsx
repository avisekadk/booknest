// src/components/KycForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldCheck, ShieldAlert, Clock, Upload } from "lucide-react";

const KycForm = () => {
  const { user } = useSelector((state) => state.auth);
  const [kycData, setKycData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    documentType: "Citizenship",
  });
  const [documentImage, setDocumentImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/kyc/status",
          { withCredentials: true }
        );
        setKycData(data);
      } catch (error) {
        toast.error("Could not fetch KYC status.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    Object.keys(formData).forEach((key) =>
      submissionData.append(key, formData[key])
    );
    submissionData.append("documentImage", documentImage);

    try {
      setIsLoading(true);
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/kyc/submit",
        submissionData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      // Refetch status
      const statusRes = await axios.get(
        "http://localhost:4000/api/v1/kyc/status",
        { withCredentials: true }
      );
      setKycData(statusRes.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Submission failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-10">Loading KYC Status...</div>;
  }

  if (kycData?.status === "Verified") {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <ShieldCheck className="mx-auto h-16 w-16 text-green-500" />
        <h2 className="text-2xl font-bold mt-4">KYC Verified</h2>
        <p className="text-gray-600 mt-2">
          Your account is fully verified. You can now access all features,
          including pre-booking.
        </p>
      </div>
    );
  }

  if (kycData?.status === "Pending") {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <Clock className="mx-auto h-16 w-16 text-yellow-500" />
        <h2 className="text-2xl font-bold mt-4">KYC Pending Approval</h2>
        <p className="text-gray-600 mt-2">
          Your submission is under review. We will notify you once it's
          processed.
        </p>
      </div>
    );
  }

  if (kycData?.status === "Rejected") {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold mt-4">KYC Rejected</h2>
        <p className="text-gray-600 mt-2">
          Reason: {kycData.details?.rejectionReason || "Not provided"}
        </p>
        <p className="text-gray-600 mt-2">
          Please contact support for more information.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">KYC Verification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name*"
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name*"
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <input
          type="text"
          name="middleName"
          placeholder="Middle Name (Optional)"
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number*"
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="documentType"
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option>Citizenship</option>
          <option>License</option>
          <option>National ID Card</option>
          <option>Passport</option>
        </select>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Document*
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto h-24 w-auto"
                />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="documentImage"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? "Submitting..." : "Submit for Verification"}
        </button>
      </form>
    </div>
  );
};

export default KycForm;
