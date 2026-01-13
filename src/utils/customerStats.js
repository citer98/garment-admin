export const calculateCustomerLifetimeValue = (customerOrders) => {
  if (!customerOrders || customerOrders.length === 0) {
    return {
      totalSpent: 0,
      avgOrderValue: 0,
      ordersCount: 0,
      firstOrderDate: null,
      lastOrderDate: null,
      frequency: 0,
      predictedValue: 0
    };
  }

  const orders = customerOrders.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const avgOrderValue = totalSpent / orders.length;
  
  const firstOrderDate = new Date(orders[0].orderDate);
  const lastOrderDate = new Date(orders[orders.length - 1].orderDate);
  
  // Calculate frequency (days between orders)
  const daysBetween = (lastOrderDate - firstOrderDate) / (1000 * 60 * 60 * 24);
  const frequency = orders.length > 1 ? daysBetween / (orders.length - 1) : 0;
  
  // Simple prediction for next 30 days
  const predictedValue = avgOrderValue * (30 / Math.max(frequency, 1));
  
  return {
    totalSpent,
    avgOrderValue,
    ordersCount: orders.length,
    firstOrderDate,
    lastOrderDate,
    frequency: Math.round(frequency),
    predictedValue: Math.round(predictedValue),
    customerType: getCustomerType(orders.length, totalSpent, frequency)
  };
};

const getCustomerType = (ordersCount, totalSpent, frequency) => {
  if (ordersCount === 1) return 'New Customer';
  if (frequency <= 30) return 'Frequent Buyer';
  if (totalSpent > 1000000) return 'VIP Customer';
  if (ordersCount >= 5) return 'Loyal Customer';
  return 'Regular Customer';
};

export const getCustomerPurchasePattern = (customerOrders) => {
  if (!customerOrders || customerOrders.length === 0) {
    return {
      monthlyPattern: {},
      categoryPattern: {},
      timePattern: {},
      recommendation: []
    };
  }

  const monthlyPattern = {};
  const categoryPattern = {};
  const timePattern = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };

  customerOrders.forEach(order => {
    // Monthly pattern
    const date = new Date(order.orderDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyPattern[monthKey] = (monthlyPattern[monthKey] || 0) + 1;

    // Time pattern
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) timePattern.morning++;
    else if (hour >= 12 && hour < 17) timePattern.afternoon++;
    else if (hour >= 17 && hour < 21) timePattern.evening++;
    else timePattern.night++;

    // Category pattern (from items)
    if (order.itemsDetail) {
      order.itemsDetail.forEach(item => {
        // Assuming product name contains category or we have category data
        const category = getCategoryFromProduct(item.product);
        categoryPattern[category] = (categoryPattern[category] || 0) + (item.qty || 0);
      });
    }
  });

  // Generate recommendations
  const recommendations = [];
  const topCategory = Object.entries(categoryPattern).sort((a, b) => b[1] - a[1])[0];
  
  if (topCategory) {
    recommendations.push(`Pelanggan sering membeli produk ${topCategory[0]}`);
  }
  
  if (timePattern.morning > timePattern.afternoon && timePattern.morning > timePattern.evening) {
    recommendations.push('Biasanya berbelanja di pagi hari');
  }
  
  const recentOrders = customerOrders
    .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
    .slice(0, 3);
  
  if (recentOrders.length >= 3) {
    const avgDaysBetween = calculateAverageDaysBetween(recentOrders);
    if (avgDaysBetween <= 7) {
      recommendations.push('Frekuensi belanja tinggi (mingguan)');
    }
  }

  return {
    monthlyPattern,
    categoryPattern,
    timePattern,
    recommendations
  };
};

const getCategoryFromProduct = (productName) => {
  if (productName.includes('Kemeja')) return 'Kemeja';
  if (productName.includes('Celana')) return 'Celana';
  if (productName.includes('Jaket')) return 'Jaket';
  if (productName.includes('Blouse')) return 'Blouse';
  return 'Lainnya';
};

const calculateAverageDaysBetween = (orders) => {
  if (orders.length < 2) return 0;
  
  let totalDays = 0;
  for (let i = 1; i < orders.length; i++) {
    const prevDate = new Date(orders[i - 1].orderDate);
    const currDate = new Date(orders[i].orderDate);
    totalDays += (currDate - prevDate) / (1000 * 60 * 60 * 24);
  }
  
  return totalDays / (orders.length - 1);
};