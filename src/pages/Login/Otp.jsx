import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../component/button/Buttons';
import ErrorMessage_Popup from '../../component/Popup_Models/ErrorMessage_Popup';
import Success_Popup from '../../component/Popup_Models/Success_Popup';
import PreLoader from "../../component/Pre_Loader/PreLoader";
import { user_verify } from '../../service/Login/Login';
import AuthLayout from './AuthLayout';

const Otp = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [showLoader, setShowLoader] = useState(false);

  // Popup States
  const [showSuccess, setShowSuccess] = useState(false);
  const[showError, setShowError] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('temp_login_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // --- MODIFIED: Accepts an optional OTP string to handle auto-submit immediately ---
  const handleSubmit = async (e, autoSubmitOtp = null) => {
    if (e) e.preventDefault();
    const otpValue = autoSubmitOtp || otp.join('');
    
    if (otpValue.length < 6) {
      setPopupMessage("Please enter the full 6-digit code.");
      setShowError(true);
      return;
    }

    setLoading(true);
    const payload = {
      loginEmail: email,
      otp: otpValue 
    };

    try {
      const response = await user_verify(payload);
      
      const successMsg = 
        response?.data?.data?.message || 
        response?.data?.message || 
        "Verification successful!";

      const apiData = response?.data?.data || response?.data;

      if (apiData?.accessToken) {
        localStorage.setItem('accessToken', apiData.accessToken);
        localStorage.setItem('email', email); 
      }

      setIsFirstTimeUser(apiData?.isFirstLogin === true);
      setPopupMessage(successMsg);
      setShowSuccess(true);

      // After short popup delay → show loader
      setTimeout(() => {
        setShowSuccess(false);
        setShowLoader(true);
      }, 1500);
      
      localStorage.removeItem('temp_login_email'); 

    } catch (error) {
      console.error("Verification Error:", error);
      
      const errorMessage = 
        error.response?.data?.data?.message || 
        error.response?.data?.message || 
        error.message || 
        "Invalid OTP. Please try again.";

      setPopupMessage(errorMessage);
      setShowError(true);
      setOtp(['', '', '', '', '', '']); // Optional: Clear OTP on error
      inputRefs.current[0].focus(); // Optional: Refocus first input
    } finally {
      setLoading(false);
    }
  };

  // --- MODIFIED: Auto-submit check added ---
  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);
    
    // Focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-Process if all 6 digits are filled
    const currentOtpString = newOtp.join('');
    if (currentOtpString.length === 6 && !loading) {
      handleSubmit(null, currentOtpString);
    }
  };

  // --- NEW: Paste functionality ---
  const handlePaste = (e) => {
    e.preventDefault();
    // Get pasted data, strip non-digits, and trim to max 6 characters
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pasteData) {
      const newOtp = [...otp];
      
      // Populate array with pasted digits
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pasteData[i] || '';
      }
      setOtp(newOtp);

      // Auto-submit if exactly 6 digits were pasted
      if (pasteData.length === 6 && !loading) {
        inputRefs.current[5].blur(); // Remove focus
        handleSubmit(null, pasteData);
      } else {
        // Focus the next empty input box
        const nextEmptyIndex = pasteData.length < 6 ? pasteData.length : 5;
        inputRefs.current[nextEmptyIndex].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        if (isFirstTimeUser) {
          navigate('first-time-login');
        } else {
          navigate('/dashboard');
        }
      }, 2000); 

      return () => clearTimeout(timer);
    }
  }, [showLoader, isFirstTimeUser, navigate]);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        if (isFirstTimeUser) {
          navigate('first-time-login'); 
        } else {
          navigate('/dashboard'); 
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, isFirstTimeUser, navigate]);

  return (
    <AuthLayout title="Verify OTP" subtitle={`We've sent a 6-digit code to ${email}`}>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="otp-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-white"
          >
            <PreLoader />
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="flex justify-between gap-2 sm:gap-4 mt-10 mb-12">
          {otp.map((digit, i) => (
            <input 
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text" 
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste} // --- NEW: Added Paste Event Handler ---
              className="w-full h-12 sm:h-16 text-center text-2xl font-bold bg-blue-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#0062a0] focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              disabled={loading} // Prevent typing while verifying
            />
          ))}
        </div>
        <Button variant="primary" type="submit" className="w-full py-4 rounded-xl font-bold" disabled={loading}>
          {loading ? "Verifying..." : "Verify & Proceed"}
        </Button>
      </form>

      {/* Success Popup */}
      <Success_Popup 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)} 
        message={popupMessage}
      />

      {/* Error Popup */}
      <ErrorMessage_Popup 
        isOpen={showError} 
        onClose={() => setShowError(false)} 
        title="Verification Failed"
        message={popupMessage}
        btnText="Try Again"
      />
    </AuthLayout>
  );
};

export default Otp;