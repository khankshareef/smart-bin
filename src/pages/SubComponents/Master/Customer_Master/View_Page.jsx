import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../../component/button/Buttons";

// IMPORT YOUR SERVICE HERE
import { customer_view } from "../../../../service/Master_Services/Master_Services";

const View_Page = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract rowId passed from the parent Table
  const { rowId } = location?.state || {};

  const [rowData, setRowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = ["Overview", "Projects", "Users", "Items"];

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchDetails = async () => {
      if (!rowId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await customer_view(rowId);
        setRowData(res?.data?.data);
      } catch (err) {
        console.error("Error fetching customer details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [rowId]);

  // --- FORMATTING HELPERS ---
  const formatModuleName = (name) => {
    if (!name) return "";
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // Helper component for Information Fields
  const InfoField = ({ label, value, isPassword = false }) => (
    <div className="flex flex-col gap-1 group">
      <span className="text-slate-400 text-[11px] font-bold tracking-widest uppercase">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {isPassword ? (
          <>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-[#0062a0] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <span className="text-slate-800 font-bold text-[16px]">
              {showPassword ? value : "••••••••"}
            </span>
          </>
        ) : (
          <span className="text-slate-800 font-bold text-[15px] group-hover:text-[#0062a0] transition-colors break-words">
            {value || "---"}
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#0062a0]" size={40} />
          <p className="text-slate-500 font-medium">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (!rowData && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 font-bold mb-4">
            No Data Found for this ID.
          </p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Extract permissions securely
  const permissionsData =
    rowData?.superAdmin?.permissions || rowData?.permissions || [];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#fcfdfe] p-4 md:p-8 font-sans text-slate-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.header
          variants={itemVariants}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#e0f2fe" }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-3 text-[#0062a0] rounded-2xl transition-all cursor-pointer"
            >
              <ArrowLeft size={24} />
            </motion.button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight capitalize">
                {rowData?.companyName}
              </h1>
              <p className="text-[#0062a0] font-medium text-sm">
                Customer Master / View
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${rowData?.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {rowData?.status === 1 ? "Active" : "Inactive"}
            </div>
            <Button
              onClick={() =>
                navigate("../create-customer", {
                  state: { rowId: rowId, mode: "edit" },
                })
              }
              variant="primary"
            >
              Edit Profile
            </Button>
          </div>
        </motion.header>

        {/* Navigation Tabs */}
        <motion.div
          variants={itemVariants}
          className="relative flex bg-[#E0F2FE] rounded-2xl p-1.5 mb-10 overflow-hidden max-w-fit shadow-inner"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative py-3 px-8 rounded-xl text-[14px] font-bold transition-colors duration-300 whitespace-nowrap cursor-pointer outline-none ${
                  isActive
                    ? "text-slate-800"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="relative z-10">{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-white rounded-xl shadow-md"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "Overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 pb-10"
            >
              {/* Quick ID Card */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <InfoField label="Customer Id" value={rowData?.customerId} />
                  <InfoField
                    label="Created On"
                    value={formatDate(rowData?.createdAt)}
                  />
                  <InfoField
                    label="Last Updated"
                    value={formatDate(rowData?.updatedAt)}
                  />
                </div>
              </motion.div>

              {/* Company Details */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm"
              >
                <div className="px-8 py-5 border-b border-slate-50 bg-white">
                  <h2 className="text-[#0062a0] font-bold text-lg">
                    Company Details
                  </h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-6">
                  <InfoField
                    label="Company Name"
                    value={rowData?.companyName}
                  />
                  <InfoField
                    label="Customer Name"
                    value={rowData?.customerName}
                  />
                  <InfoField
                    label="Customer Type"
                    value={rowData?.customerType?.customerTypeName}
                  />

                  <InfoField
                    label="Transit Days"
                    value={`${rowData?.transitDays} Days`}
                  />
                  <InfoField label="GST Number" value={rowData?.gstNumber} />
                </div>
              </motion.div>

              {/* Customer Login & Contact Details */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm"
              >
                <div className="px-8 py-5 border-b border-slate-50 bg-white">
                  <h2 className="text-[#0062a0] font-bold text-lg">
                    Customer Login & Contact Details
                  </h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-6">
                  <InfoField label="Admin Email" value={rowData?.adminEmail} />
                  <InfoField label="Position" value={rowData?.position} />
                  <InfoField label="Department" value={rowData?.department} />

                  <InfoField
                    label="Primary Number"
                    value={
                      rowData?.mobileNumber?.[0]
                        ? `+91 ${rowData.mobileNumber[0]}`
                        : "---"
                    }
                  />
                  <InfoField
                    label="Secondary Number"
                    value={
                      rowData?.mobileNumber?.[1]
                        ? `+91 ${rowData.mobileNumber[1]}`
                        : "---"
                    }
                  />
                </div>
              </motion.div>

              {/* Address Details */}
              <motion.div
                variants={itemVariants}
                className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm"
              >
                <div className="px-8 py-5 border-b border-slate-50 bg-white">
                  <h2 className="text-[#0062a0] font-bold text-lg">
                    Address Information
                  </h2>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
                  <InfoField
                    label="Shipping Address 1"
                    value={rowData?.shippingAddress1}
                  />
                  <InfoField
                    label="Shipping Address 2"
                    value={rowData?.shippingAddress2}
                  />
                  <InfoField
                    label="Billing Address"
                    value={rowData?.billingAddress}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200"
            >
              <p className="text-slate-400 font-medium">
                Data for {activeTab} will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default View_Page;
