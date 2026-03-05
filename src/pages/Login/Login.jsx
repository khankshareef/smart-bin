import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReUsableInput_Fields from '../../component/ReUsableInput_Fields/ReUsableInput_Fields';
import Button from '../../component/button/Buttons';
import { loginAPI } from '../../service/Login/Login';
import AuthLayout from './AuthLayout';
// Import the Error Popup
import ErrorMessage_Popup from '../../component/Popup_Models/ErrorMessage_Popup';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ loginEmail: '', loginPassword: '' });
  const [loading, setLoading] = useState(false);

  // --- POPUP STATE ---
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Sending Login Payload:", formData);

      const response = await loginAPI(formData);
      
      // Save email for OTP verification
      localStorage.setItem('temp_login_email', formData.loginEmail);

      const apiData = response?.data?.data || response?.data; 

      if (apiData?.isFirstLogin === true) {
        navigate('first-time-login'); 
      } else {
        navigate('otp'); 
      }
    } catch (error) {
      console.error("Login Error Object:", error);
      
      // --- UPDATED ERROR EXTRACTION LOGIC ---
      // 1. Check for your specific structure: error.response.data.data.message
      // 2. Fallback to standard Axios error message
      // 3. Fallback to hardcoded string
      const errorMessage = 
        error.response?.data?.data?.message || 
        error.response?.data?.message || 
        error.message || 
        "Something went wrong";
      
      // --- SHOW POPUP ---
      setErrorMsg(errorMessage);
      setShowError(true);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login" subtitle="Welcome back! Please enter your details.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <ReUsableInput_Fields 
            label="Email Address" 
            type="email" 
            value={formData.loginEmail}
            onChange={(e) => setFormData({...formData, loginEmail: e.target.value})}
            required
          />
          <ReUsableInput_Fields 
            label="Password" 
            type="password" 
            value={formData.loginPassword}
            onChange={(e) => setFormData({...formData, loginPassword: e.target.value})}
            required
          />
        </div>

        <div className="flex items-center justify-between mt-4 mb-8">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0062a0]" />
            <span className="text-sm text-slate-600 font-medium">Remember me</span>
          </label>
          <button 
            type="button"
            onClick={() => navigate('forgot-password')}
            className="text-sm font-bold text-[#0062a0] hover:underline cursor-pointer"
          >
            Forgot password?
          </button>
        </div>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-full py-4 rounded-xl text-lg font-bold"
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* --- ERROR POPUP COMPONENT --- */}
      <ErrorMessage_Popup 
        isOpen={showError} 
        onClose={() => setShowError(false)} 
        title="Login Failed"
        message={errorMsg}
        btnText="Try Again"
      />
    </AuthLayout>
  );
};

export default Login;