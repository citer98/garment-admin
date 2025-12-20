// utils/formatters.js
export const formatCurrency = (value) => {
  const num = Number(value) || 0;
  return num.toLocaleString('id-ID');
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Tanggal tidak tersedia';
  try {
    return new Date(dateString).toLocaleDateString('id-ID');
  } catch (error) {
    return 'Tanggal tidak valid';
  }
};

export const safeString = (value) => {
  return value || '';
};

export const safeNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};