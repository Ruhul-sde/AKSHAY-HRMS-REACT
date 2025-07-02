import React from 'react';
import { AlertCircle } from 'lucide-react';

const InputField = React.forwardRef(({
  icon: Icon,
  label,
  name,
  type = 'text',
  required = false,
  readOnly = false,
  error,
  children,
  ...props
}, ref) => (
  <div className="mb-5">
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2" htmlFor={name}>
      {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {children || (
        <input
          id={name}
          type={type}
          name={name}
          ref={ref}
          required={required}
          readOnly={readOnly}
          className={`w-full border rounded-lg px-4 py-3 transition-all duration-200 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : readOnly
                ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
                : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          } focus:outline-none`}
          {...props}
        />
      )}
      {error && (
        <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
      )}
    </div>
    {error && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <span>{error}</span>
      </p>
    )}
  </div>
));

export default React.memo(InputField); 