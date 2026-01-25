export const Card = ({ children, className = '', shadow = 'sm', border = true }) => (
  <div className={`
    bg-white rounded-xl 
    ${shadow === 'none' ? '' : shadow === 'sm' ? 'shadow-sm' : shadow === 'md' ? 'shadow' : 'shadow-lg'} 
    ${border ? 'border border-gray-200' : ''} 
    ${className}
  `}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', border = true }) => (
  <div className={`
    px-4 sm:px-6 py-3 sm:py-4 
    ${border ? 'border-b border-gray-100' : ''} 
    ${className}
  `}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', padding = 'normal' }) => {
  const paddingClass = padding === 'none' ? '' : 
                      padding === 'small' ? 'p-3 sm:p-4' : 
                      padding === 'normal' ? 'p-4 sm:p-6' : 
                      'p-6 sm:p-8';
  
  return (
    <div className={`${paddingClass} ${className}`}>
      {children}
    </div>
  );
};