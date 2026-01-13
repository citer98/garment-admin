export const exportCustomerHistory = (orders) => {
  if (!orders || orders.length === 0) {
    alert('Tidak ada data untuk diexport');
    return;
  }

  // Prepare CSV content
  const headers = ['ID Pesanan', 'Tanggal', 'Pelanggan', 'Jumlah Item', 'Total', 'Status', 'Catatan'];
  
  const csvRows = [
    headers.join(','),
    ...orders.map(order => [
      order.id,
      order.orderDate,
      order.customerName,
      order.items,
      order.totalAmount,
      order.status,
      order.notes ? `"${order.notes.replace(/"/g, '""')}"` : ''
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `riwayat-pelanggan-${orders[0].customerName}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert(`✅ Data riwayat berhasil diexport!`);
};

export const exportOrderToCSV = (order) => {
  if (!order) {
    alert('Tidak ada data order');
    return;
  }

  const headers = ['Produk', 'Qty', 'Ukuran', 'Warna', 'Harga', 'Subtotal', 'Catatan'];
  
  const csvRows = [
    headers.join(','),
    ...order.itemsDetail.map(item => [
      item.product,
      item.qty,
      item.size || '',
      item.color || '',
      item.price,
      item.subtotal || (item.qty * item.price),
      item.notes?.map(note => note.text).join('; ') || ''
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `order-${order.id}-items.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};