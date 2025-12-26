// utils/timelineHelpers.js
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '';
    }
    
    const diffMs = end - start;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    const hours = diffHours % 24;
    const minutes = diffMinutes % 60;
    
    if (diffDays > 0) {
      return `${diffDays}h ${hours}j ${minutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}j ${minutes}m`;
    }
    return `${minutes}m`;
  } catch (error) {
    console.error('Error calculating duration:', error);
    return '';
  }
};

export const formatDateTimeForInput = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return '';
    
    // Format to YYYY-MM-DDTHH:mm
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    return '';
  }
};

export const initializeTimelineData = (orderStatus, orderDate) => {
  const steps = [
    {
      id: 1,
      status: 'draft',
      label: 'Draft',
      description: 'Pesanan dibuat',
      startTime: orderDate ? `${orderDate}T08:00:00` : '',
      completeTime: '',
      duration: '',
      employee: 'Admin',
      notes: '',
      isCompleted: true,
      isInProgress: false
    },
    {
      id: 2,
      status: 'processing',
      label: 'Diproses',
      description: 'Verifikasi & persiapan',
      startTime: '',
      completeTime: '',
      duration: '',
      employee: '',
      notes: '',
      isCompleted: false,
      isInProgress: false
    },
    {
      id: 3,
      status: 'production',
      label: 'Produksi',
      description: 'Proses manufacturing',
      startTime: '',
      completeTime: '',
      duration: '',
      employee: '',
      notes: '',
      isCompleted: false,
      isInProgress: false
    },
    {
      id: 4,
      status: 'completed',
      label: 'Selesai',
      description: 'Quality check & packing',
      startTime: '',
      completeTime: '',
      duration: '',
      employee: '',
      notes: '',
      isCompleted: false,
      isInProgress: false
    },
    {
      id: 5,
      status: 'delivered',
      label: 'Terkirim',
      description: 'Pengiriman ke customer',
      startTime: '',
      completeTime: '',
      duration: '',
      employee: '',
      notes: '',
      isCompleted: false,
      isInProgress: false
    }
  ];
  
  const statusOrder = ['draft', 'processing', 'production', 'completed', 'delivered'];
  const currentIndex = statusOrder.indexOf(orderStatus);
  
  return steps.map((step, index) => {
    const isCompleted = index <= currentIndex;
    const isInProgress = index === currentIndex;
    
    // Generate demo times for completed steps
    if (isCompleted && index > 0) {
      const dayOffset = index;
      return {
        ...step,
        startTime: orderDate 
          ? new Date(new Date(orderDate).getTime() + (dayOffset * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] + 'T08:00:00'
          : '',
        completeTime: index < currentIndex 
          ? new Date(new Date(orderDate).getTime() + (dayOffset * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] + 'T17:00:00'
          : '',
        duration: index < currentIndex ? '8 jam' : '',
        employee: index < currentIndex ? 'Departemen' : '',
        isCompleted,
        isInProgress
      };
    }
    
    return {
      ...step,
      isCompleted,
      isInProgress
    };
  });
};