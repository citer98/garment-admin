import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 5000,
  onClose,
  position = 'top-right'
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed ${positions[position]} z-50 max-w-[calc(100vw-2rem)] w-full sm:max-w-sm
      p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start space-x-3
      animate-slide-in
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base break-words">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="flex-shrink-0 ml-2 hover:opacity-70 p-1 -mt-1 -mr-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', position = 'top-right') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, position }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
};

// Hook untuk menggunakan toast
export const useToast = () => {
  const showToast = (message, type = 'success', position = 'top-right') => {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
      console.warn('Toast container not found');
      return;
    }

    const toast = document.createElement('div');
    toast.className = `
      fixed ${positions[position]} z-50 max-w-[calc(100vw-2rem)] w-full sm:max-w-sm
      p-4 rounded-lg border shadow-lg ${colors[type]} flex items-start space-x-3
      animate-slide-in
    `;
    
    toast.innerHTML = `
      <div class="flex-shrink-0 mt-0.5">
        ${icons[type].outerHTML}
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-sm sm:text-base break-words">${message}</p>
      </div>
      <button class="flex-shrink-0 ml-2 hover:opacity-70 p-1 -mt-1 -mr-1 close-toast">
        ${X.outerHTML}
      </button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('animate-slide-in');
        toast.classList.add('animate-slide-out');
        setTimeout(() => {
          if (toast.parentNode) {
            toastContainer.removeChild(toast);
          }
        }, 300);
      }
    }, 5000);

    // Close button
    toast.querySelector('.close-toast').addEventListener('click', () => {
      toast.classList.remove('animate-slide-in');
      toast.classList.add('animate-slide-out');
      setTimeout(() => {
        if (toast.parentNode) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    });

    return toast;
  };

  return { showToast };
};