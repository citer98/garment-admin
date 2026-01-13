export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  ...props 
}) => {
  const base = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 active:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400 active:bg-gray-100",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400 active:bg-gray-200",
  };
  
  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = loading ? 'opacity-75 cursor-wait' : '';

  return (
    <button 
      className={`${base} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="mr-2">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="ml-2">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};