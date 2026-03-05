import { X } from "lucide-react";
import { useEffect, useState } from "react";
import Confirmation_Popup from "../../../../component/Popup_Models/Confirmation_Popup";
import ErrorMessage_Popup from "../../../../component/Popup_Models/ErrorMessage_Popup";
import Success_Popup from "../../../../component/Popup_Models/Success_Popup";
import ReUsableInput_Fields from "../../../../component/ReUsableInput_Fields/ReUsableInput_Fields";
import { item_category_create } from "../../../../service/Master_Services/Master_Services";

const Create_Category_Model = ({ isOpen, onClose, onRefresh }) => {
  const [isAnimate, setIsAnimate] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isError, setIsError] = useState(false);
  const [apiMessage, setApiMessage] = useState(""); // State to store API messages

  const [formData, setFormData] = useState({
    categoryName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Step 1: Open Confirmation Popup
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.categoryName.trim()) {
      setApiMessage("Please enter a category name before proceeding.");
      setIsError(true);
      return;
    }
    setIsConfirm(true);
  };

  // Step 2: Actual API Call after Confirmation
  const handleConfirmAction = async () => {
    setIsConfirm(false); // Close confirmation popup
    try {
      const res = await item_category_create(formData);

      if (res?.data?.success) {
        setApiMessage(res.data.message || "Category Created Successfully!"); // API Success Message
        setIsSuccess(true);
        setFormData({ categoryName: "" });
        if (onRefresh) onRefresh();

        // Optional: Close the main model after a delay so user sees success
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error("Error creating category:", err);
      // Capture message from API error response
      const errorMsg =
        err.response?.data?.message || "An unexpected error occurred.";
      setApiMessage(errorMsg);
      setIsError(true);
    }
  };

  // Handle smooth entrance/exit animation logic
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsAnimate(true), 10);
    } else {
      setIsAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimate) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimate ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop / Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-[750px] bg-white rounded-[20px] shadow-2xl p-10 transform transition-all duration-300 ease-out ${
          isAnimate ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute right-8 top-8 text-gray-800 hover:text-black transition-colors cursor-pointer"
        >
          <X size={28} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-[32px] font-bold text-gray-900 mb-10">
            Create Category
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-[550px]">
            <div className="mb-10">
              <ReUsableInput_Fields
                label="Category Name"
                placeholder="Enter Category Name"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                isActive={formData.categoryName.length > 0}
                className="!mt-0"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-[#0062a0] text-white text-lg font-semibold px-10 py-3 rounded-xl hover:bg-[#005286] active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popups */}
      <Confirmation_Popup
        isOpen={isConfirm}
        onClose={() => setIsConfirm(false)}
        message="Are you sure you want to create this category?"
        onConfirm={handleConfirmAction} // Triggers the API call
      />

      <Success_Popup
        isOpen={isSuccess}
        onClose={() => setIsSuccess(false)}
        message={apiMessage} // Message from API
      />

      <ErrorMessage_Popup
        isOpen={isError}
        onClose={() => setIsError(false)}
        message={apiMessage} // Message from API Error
      />
    </div>
  );
};

export default Create_Category_Model;
