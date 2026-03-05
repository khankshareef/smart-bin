import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

const ReUsableInput_Fields = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  options = [],
  labelKey = "label",
  valueKey = "value",
  apiEndpoint = null,
  error: externalError,
  isActive = false, // External active state
  required = false,
  className = "",
  disabled = false,
  // New props
  passwordValidation = false, // Enable password validation
  searchable = false,         // Enable searchable select (only for type="select")
}) => {
  // Existing states
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // New states for searchable select
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Internal password validation error
  const [internalError, setInternalError] = useState('');

  // Combine errors: external overrides internal
  const error = externalError || internalError;

  // Fetch options from API if needed
  useEffect(() => {
    if (apiEndpoint && type === "select") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(apiEndpoint);
          const data = await response.json();
          setDynamicOptions(data);
        } catch (err) {
          console.error("Input API Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [apiEndpoint, type]);

  // Validate password when value changes (if enabled)
  useEffect(() => {
    if (type === "password" && passwordValidation) {
      validatePassword(value);
    } else {
      // Clear internal error if validation disabled or type not password
      setInternalError('');
    }
  }, [value, type, passwordValidation]);

  const validatePassword = (pwd) => {
    if (!pwd) {
      setInternalError(required ? 'Password is required' : '');
      return;
    }
    const minLength = 8;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);

    if (pwd.length < minLength) {
      setInternalError(`Password must be at least ${minLength} characters`);
    } else if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      setInternalError('Password must contain at least one lowercase, one uppercase, one number, and one special character (!@#$%^&*)');
    } else {
      setInternalError('');
    }
  };

  // Determine final options for select
  const finalOptions = apiEndpoint ? dynamicOptions : options;

  // Filter options for searchable select
  const filteredOptions = finalOptions.filter(item => {
    const label = item[labelKey] || item;
    return label.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle option selection in searchable select
  const handleSelectOption = (selectedValue) => {
    // Create a synthetic event object to mimic native select
    const event = {
      target: {
        name,
        value: selectedValue,
      },
    };
    onChange(event);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Floating label logic
  const isFloating = 
    isFocused || 
    (value !== undefined && value !== null && value.toString().length > 0) || 
    type === "date" || 
    type === "select" ||
    isOpen || // Keep label up when dropdown is open
    isActive;

  const labelStyles = `absolute transition-all duration-200 pointer-events-none z-10 left-3 px-1.5 ${
    isFloating 
      ? "-top-2.5 text-[12px] bg-white"  // Top border position
      : "top-1/2 -translate-y-1/2 text-[14px] bg-transparent" // Inside position
  } ${
    error ? "text-red-500 font-semibold" : (isFocused || isActive || isOpen) ? "text-[#0062a0]" : "text-gray-500"
  }`;

  const inputBaseStyles = `w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-300 outline-none bg-transparent ${
    error 
      ? "border-red-500" 
      : (isFocused || isActive || isOpen) 
        ? "border-[#0062a0] shadow-md shadow-blue-900/10 ring-1 ring-[#0062a0]/10" 
        : "border-slate-300 hover:border-[#0062a0]/50 focus:border-[#0062a0]"
  } ${disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}`;

  return (
    <div className={`relative mt-5 mb-1.5 w-full ${className}`} ref={type === "select" && searchable ? dropdownRef : null}>
      {/* Floating Label */}
      {label && (
        <label className={labelStyles}>
          {label.toUpperCase()} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {type === "select" ? (
  <div className="w-full">
    <Select
      options={options}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(selected) =>
        onChange({
          target: {
            name,
            value: selected ? selected.value : "",
          },
        })
      }
      isDisabled={disabled || loading}
      isLoading={loading}
      placeholder={placeholder}
      isSearchable
      className="text-sm"
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: "42px",
          borderRadius: "0.5rem",
          borderColor: state.isFocused ? "#0062a0" : "#e5e7eb",
          boxShadow: state.isFocused
            ? "0 0 0 2px rgba(0,98,160,0.2)"
            : "none",
          "&:hover": {
            borderColor: "#0062a0",
          },
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
        }),
      }}
    />
  </div>
) : type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder={isFocused ? placeholder : ""}
            className={`${inputBaseStyles} min-h-[100px] py-2.5 resize-none`}
          />
        ) : (
          // ---------- Input (text, password, etc.) ----------
          <div className="relative w-full">
            <input
              type={type === "password" ? (showPassword ? "text" : "password") : type}
              name={name}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder={isFocused ? placeholder : ""}
              className={inputBaseStyles}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0062a0] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-[10px] text-red-500 font-medium mt-1 ml-2 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default ReUsableInput_Fields;