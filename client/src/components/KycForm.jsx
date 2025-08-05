import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldCheck, ShieldAlert, Clock, Upload } from "lucide-react";
import Header from "../layout/Header";

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
    if (!documentImage) {
      toast.error("Please upload a document image.");
      return;
    }
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
    return (
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        <Header />
        <div className="text-center p-10 font-inter text-lg text-gray-700">
          Loading KYC Status...
        </div>
      </main>
    );
  }

  if (kycData?.status === "Verified") {
    return (
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen flex justify-center items-center">
        <Header />
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="p-4 rounded-full bg-green-100 inline-block">
            <ShieldCheck className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mt-4 text-[#2C3E50]">
            KYC Verified
          </h2>
          <p className="text-gray-600 mt-2">
            Your account is fully verified. You can now access all features,
            including pre-booking.
          </p>
        </div>
      </main>
    );
  }

  if (kycData?.status === "Pending") {
    return (
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen flex justify-center items-center">
        <Header />
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="p-4 rounded-full bg-yellow-100 inline-block">
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mt-4 text-[#2C3E50]">
            KYC Pending Approval
          </h2>
          <p className="text-gray-600 mt-2">
            Your submission is under review. We will notify you once it's
            processed.
          </p>
        </div>
      </main>
    );
  }

  if (kycData?.status === "Rejected") {
    return (
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen flex justify-center items-center">
        <Header />
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="p-4 rounded-full bg-red-100 inline-block">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mt-4 text-[#2C3E50]">
            KYC Rejected
          </h2>
          <p className="text-gray-600 mt-2">
            Your verification was rejected. Please review the reason below and
            resubmit the form.
          </p>
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-800">
              Reason for Rejection:
            </p>
            <p className="text-sm text-red-500 mt-1">
              {kycData.details?.rejectionReason || "Not provided"}
            </p>
          </div>
          <button
            onClick={() => {
              setKycData(null);
              setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                phone: "",
                documentType: "Citizenship",
              });
              setDocumentImage(null);
              setPreview("");
            }}
            className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Resubmit Form
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-2">
          KYC Verification
        </h2>
        <p className="text-gray-600 mb-6">
          Please fill out the form below to verify your identity and unlock all
          features.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="middleName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Middle Name (Optional)
            </label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              placeholder="Middle Name"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ""}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Phone Number"
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>
            <label
              htmlFor="documentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Document Type
            </label>
            <select
              id="documentType"
              name="documentType"
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 bg-white"
            >
              <option>Citizenship</option>
              <option>License</option>
              <option>National ID Card</option>
              <option>Passport</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Document*
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition duration-200">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto h-24 w-auto rounded-md shadow-sm"
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
                <p className="text-xs text-gray-500">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit for Verification"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default KycForm;
