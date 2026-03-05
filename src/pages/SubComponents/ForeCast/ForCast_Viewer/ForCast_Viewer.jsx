import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import Download_Button from '../../../../component/button/Download_Button';
import Success_Popup from '../../../../component/Popup_Models/Success_Popup';
import SearchBar from '../../../../component/SearchBar/SearchBar';
import ReUsable_Table from '../../../../component/Table/ReUsable_Table';

const ForCast_Viewer = () => {
  const [successModel, setSuccessModel] = useState(false);
    // --- NEW: State for Selection ---
    const [selectedRows, setSelectedRows] = useState([]);
  

  // Dummy Data for Dropdowns
  const dropdownData = {
    customers: ["Sarah", "Prabha", "Sarath", "Abu", "Ajin", "Snega"],
    projects: ["i20", "Swift", "Creta", "Hector", "Ternoda", "City", "Innova"],
    itemNames: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]
  };

  // Table Data
  const [data] = useState([
    { id: 1, customer: "Sarah", project: "i20", item: "Item 1", m1_p: 235, m1_s: 345, m2_p: 235, m2_s: 235, m3_p: 123, m3_s: 235 },
    { id: 2, customer: "Prabha", project: "Swift", item: "Item 2", m1_p: 345, m1_s: 235, m2_p: 235, m2_s: 235, m3_p: 345, m3_s: 245 },
    { id: 3, customer: "Sarath", project: "Creta", item: "Item 3", m1_p: 435, m1_s: 393, m2_p: 235, m2_s: 245, m3_p: 345, m3_s: 345 },
    { id: 4, customer: "Abu", project: "Hector", item: "Item 4", m1_p: 535, m1_s: 235, m2_p: 345, m2_s: 235, m3_p: 235, m3_s: 235 },
    { id: 5, customer: "Ajin", project: "Ternoda", item: "Item 5", m1_p: 635, m1_s: 393, m2_p: 235, m2_s: 243, m3_p: 235, m3_s: 235 },
    { id: 6, customer: "Snega", project: "City", item: "Item 6", m1_p: 735, m1_s: 235, m2_p: 235, m2_s: 835, m3_p: 235, m3_s: 235 },
    { id: 7, customer: "Kaviya", project: "Innova", item: "Item 7", m1_p: 835, m1_s: 393, m2_p: 235, m2_s: 235, m3_p: 345, m3_s: 235 },
  ]);

  // Column Definition for ReUsable_Table
  // Note: Since standard reusable tables are single-header, we label the month columns clearly.
  const columns = [
    { header: 'Customer', key: 'customer' },
    { header: 'Project Name', key: 'project' },
    { header: 'Item Name', key: 'item' },
    { header: '1st Month Prod', key: 'm1_p' },
    { header: '1st Month Supply', key: 'm1_s' },
    { header: '2nd Month Prod', key: 'm2_p' },
    { header: '2nd Month Supply', key: 'm2_s' },
    { header: '3rd Month Prod', key: 'm3_p' },
    { header: '3rd Month Supply', key: 'm3_s' },
  ];

  useEffect(() => {
    if (successModel) {
      const timer = setTimeout(() => setSuccessModel(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [successModel]);
   const handleSelectionChange = (selectedIds) => {
    setSelectedRows(selectedIds);
    console.log("Selected IDs:", selectedIds);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, staggerChildren: 0.05 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#fcfdfe] p-4 md:p-8 font-sans text-slate-800"
    >
      <div className="max-w-[1600px] mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Forecast Viewer</h1>
          </div>
        </div>

        {/* --- FILTERS SECTION --- */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-end gap-3 mb-6">
          <FilterDropdown label="Customer" options={dropdownData.customers} />
          <FilterDropdown label="Project" options={dropdownData.projects} />
          <FilterDropdown label="Item Name" options={dropdownData.itemNames} />

          <Download_Button onClick={() => setSuccessModel(true)} />
        </motion.div>

        {/* --- TABLE SECTION --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-white flex justify-between items-center">
          <div className="max-w-md w-full">
            <SearchBar />
          </div>
          {/* Show a bulk delete button if items are selected */}
          {selectedRows.length > 0 && (
            <span className="text-sm font-medium text-[#0062a0] animate-in fade-in slide-in-from-right-2">
              {selectedRows.length} Items Selected
            </span>
          )}
        </div>
          <div className="p-0">
            <ReUsable_Table
              columns={columns} 
              data={data}
              showToggle={false}
              showActions={false} // Forecast Viewer usually doesn't have inline actions in the image
                selectedRows={selectedRows}
                onSelectionChange={handleSelectionChange}
            />
          </div>
        </motion.div>
      </div>

      {/* Success Popup */}
      <Success_Popup
        isOpen={successModel}
        onClose={() => setSuccessModel(false)}
        message="Forecast Downloaded Successfully!"
      />
    </motion.div>
  );
};

// --- Helper Component for Dropdowns ---
const FilterDropdown = ({ label, options }) => {
  return (
    <div className="relative group min-w-[130px]">
      <button className="w-full flex items-center justify-between gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-[#0062a0] hover:border-[#0062a0] transition-all">
        {label}
        <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 overflow-hidden">
        {options.map((opt, i) => (
          <div key={i} className="px-4 py-2.5 text-sm text-slate-600 hover:bg-[#e6f4ff] hover:text-[#0062a0] cursor-pointer transition-colors border-b last:border-0 border-slate-50">
            {opt}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForCast_Viewer;