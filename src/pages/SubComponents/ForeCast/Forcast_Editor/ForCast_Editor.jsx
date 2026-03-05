import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Project Components
import Confirmation_Popup from '../../../../component/Popup_Models/Confirmation_Popup';
import Success_Popup from '../../../../component/Popup_Models/Success_Popup';
import ReUsableInput_Fields from '../../../../component/ReUsableInput_Fields/ReUsableInput_Fields';
import Button from '../../../../component/button/Buttons';

const ForCast_Editor = () => {
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [successModel, setSuccessModel] = useState(false);

  // Main Header State
  const [formData, setFormData] = useState({
    forecastId: 'FOR1235',
    customerName: '',
    projectName: '',
    bomId: '',
  });

  // Dynamic Forecast Rows State
  const [forecastRows, setForecastRows] = useState([
    { id: Date.now(), month: 'December, 2025', quantity: '20153' }
  ]);

  useEffect(() => {
    if (successModel) {
      const timer = setTimeout(() => {
        setSuccessModel(false);
        setConfirm(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [successModel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Row Logic
  const handleAddRow = () => {
    setForecastRows([...forecastRows, { id: Date.now(), month: '', quantity: '' }]);
  };

  const handleRemoveRow = (id) => {
    if (forecastRows.length > 1) {
      setForecastRows(forecastRows.filter(row => row.id !== id));
    }
  };

  const handleRowChange = (id, field, value) => {
    setForecastRows(forecastRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Framer Motion Variants (Consistent with Bin_Create)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: 'spring', stiffness: 100, damping: 15 } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#fcfdfe] p-4 md:p-8"
    >
      <div className="max-w-[1400px] mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 p-6 md:p-10">
        
        {/* --- HEADER SECTION --- */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Forecast Editor
            </h1>
            <p className="text-[#0062a0] font-medium text-lg mt-1">Forecast</p>
          </div>
        </motion.div>

        {/* --- MAIN FORM GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          <motion.div variants={itemVariants}>
            <ReUsableInput_Fields 
              label="Forecast ID" 
              name="forecastId" 
              value={formData.forecastId} 
              disabled={true} 
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ReUsableInput_Fields
              label="Customer Name"
              name="customerName"
              type="select"
              placeholder=" "
              options={[{ label: 'Select Customer', value: '' }]}
              value={formData.customerName}
              onChange={handleChange}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ReUsableInput_Fields label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} />
          </motion.div>

          <motion.div variants={itemVariants}>
            <ReUsableInput_Fields label="BOM ID" name="bomId" value={formData.bomId} onChange={handleChange} />
          </motion.div>
        </div>

        {/* --- PROJECT FORECAST SECTION --- */}
        <motion.div variants={itemVariants} className="mt-12">
          <h2 className="text-2xl font-bold text-[#0062a0] mb-8">
            Project Forecast (Month)
          </h2>

          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {forecastRows.map((row, index) => (
                <motion.div 
                  key={row.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full"
                >
                  <div className="flex-1 w-full">
                    <ReUsableInput_Fields 
                      label="Forecast Month" 
                      type="text" // Change to "date" if your ReUsable component supports it
                      placeholder="Select Month"
                      value={row.month}
                      onChange={(e) => handleRowChange(row.id, 'month', e.target.value)}
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <ReUsableInput_Fields 
                      label="Production Quality" 
                      value={row.quantity}
                      onChange={(e) => handleRowChange(row.id, 'quantity', e.target.value)}
                    />
                  </div>

                  {/* Actions Buttons Container */}
                  <div className="flex items-center gap-3 pb-1.5 h-full">
                    {index === forecastRows.length - 1 ? (
                      <button 
                        onClick={handleAddRow}
                        className="p-3 bg-[#e6f4ff] text-[#0062a0] rounded-xl hover:bg-blue-100 transition-all active:scale-90"
                      >
                        <Plus size={24} strokeWidth={3} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-3 bg-[#e6f4ff] text-slate-800 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
                      >
                        <Trash2 size={24} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* --- FOOTER BUTTONS --- */}
        <motion.div variants={itemVariants} className="flex items-center gap-6 justify-end mt-16 mb-4">
          <Button
            onClick={() => setConfirm(true)}
            variant="primary"
          >
            Create
          </Button>
        </motion.div>
      </div>

      {/* POPUPS */}
      <Confirmation_Popup
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => setSuccessModel(true)}
        message="Are you sure you want to Create Forecast?"
      />
      <Success_Popup
        isOpen={successModel}
        onClose={() => setSuccessModel(false)}
        message="Forecast Created Successfully!"
      />
    </motion.div>
  );
};

export default ForCast_Editor;