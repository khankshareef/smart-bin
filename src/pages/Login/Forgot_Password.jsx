import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReUsableInput_Fields from '../../component/ReUsableInput_Fields/ReUsableInput_Fields';
import Button from '../../component/button/Buttons';
import { Forgot_password } from '../../service/Login/Login';
import AuthLayout from './AuthLayout';
// Import the Error Popup
import ErrorMessage_Popup from '../../component/Popup_Models/ErrorMessage_Popup';

const Forgot_Password = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // --- POPUP STATE ---
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Backend expects loginEmail
      const payload = { loginEmail: email }; 
      const response = await Forgot_password(payload);
      
      // If success, navigate to the password change screen
      navigate('../forgot-change-password');
      
    } catch (error) {
      console.error("Forgot Password Error:", error);
      
      // --- EXTRACT NESTED MESSAGE ---
      // Path: error.response.data.data.message
      const errorMessage = 
        error.response?.data?.data?.message || 
        error.response?.data?.message || 
        error.message || 
        "Email not found or server error";

      // --- SHOW POPUP ---
      setErrorMsg(errorMessage);
      setShowError(true);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="No worries! Enter your email and we'll send you a link to reset your password."
    >
      <motion.form
        onSubmit={handleSubmit}
        className="flex flex-col"
      >
        <div className="flex justify-center mb-8">
            <div className="p-4 bg-blue-50 rounded-2xl text-[#0062a0]">
                <KeyRound size={40} strokeWidth={1.5} />
            </div>
        </div>

        <ReUsableInput_Fields 
          label="Email Address" 
          type="email" 
          placeholder="e.g. admin@smartbin.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Button 
          variant="primary" 
          className="w-full py-4 mt-8 rounded-xl text-lg font-bold shadow-lg shadow-blue-900/20"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>

        <button 
          type="button"
          onClick={() => navigate('/login')}
          className="mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0062a0] transition-colors group cursor-pointer"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
      </motion.form>

      {/* --- ERROR POPUP COMPONENT --- */}
      <ErrorMessage_Popup 
        isOpen={showError} 
        onClose={() => setShowError(false)} 
        title="Reset Failed"
        message={errorMsg}
        btnText="Close"
      />
    </AuthLayout>
  );
};

export default Forgot_Password;