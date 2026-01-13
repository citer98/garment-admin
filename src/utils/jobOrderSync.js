// Utilitas untuk sinkronisasi Job List dan Order

export const syncOrderWithJobs = (order) => {
  // Generate jobs berdasarkan order
  const jobs = generateJobsFromOrder(order);
  
  // Simpan jobs ke available jobs
  const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
  
  // Filter out existing jobs for this order
  const filteredJobs = availableJobs.filter(j => !j.order_id.includes(order.id));
  
  // Add new jobs
  const updatedJobs = [...filteredJobs, ...jobs];
  localStorage.setItem('availableJobs', JSON.stringify(updatedJobs));
  
  return jobs;
};

export const generateJobsFromOrder = (order) => {
  if (!order || order.status === 'cancelled' || order.status === 'draft') {
    return [];
  }

  const jobs = [];
  const productionSteps = [
    { department: 'Potong', priority: 'tinggi' },
    { department: 'Jahit', priority: 'sedang' },
    { department: 'Finishing', priority: 'sedang' },
    { department: 'Packing', priority: 'rendah' },
    { department: 'QC', priority: 'tinggi' }
  ];

  const orderDate = new Date(order.orderDate || new Date());
  
  productionSteps.forEach((step, index) => {
    // Tentukan status order yang memerlukan step ini
    const shouldGenerate = 
      (order.status === 'processing' && index === 0) ||
      (order.status === 'production' && index <= 2) ||
      (order.status === 'completed' && index <= 3) ||
      (order.status === 'delivered' && index <= 4);

    if (shouldGenerate) {
      const deadline = new Date(orderDate);
      deadline.setDate(deadline.getDate() + (index * 2) + 2);

      const job = {
        id: `${order.id}-${step.department}-${Date.now()}-${index}`,
        order_id: order.id,
        product_name: order.itemsDetail?.[0]?.product || 'Produk',
        qty: order.items || 0,
        status: 'menunggu',
        department: step.department,
        deadline: deadline.toISOString().split('T')[0],
        notes: `Proses ${step.department} untuk order ${order.id}`,
        created_at: new Date().toLocaleString('id-ID'),
        complexity: order.items > 15 ? 'tinggi' : order.items > 5 ? 'sedang' : 'rendah',
        estimated_time: order.items > 15 ? '2-3 hari' : order.items > 5 ? '1-2 hari' : '1 hari',
        total_amount: order.totalAmount || 0,
        customer_name: order.customerName || 'Pelanggan',
        priority: step.priority
      };

      jobs.push(job);
    }
  });

  return jobs;
};

export const updateOrderTimelineFromJob = (orderId, job) => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const orderIndex = orders.findIndex(o => o.id === orderId);
  
  if (orderIndex === -1) return;

  const order = orders[orderIndex];
  
  if (!order.timeline) {
    order.timeline = [];
  }

  const timelineStep = order.timeline.find(step => step.department === job.department);
  
  if (timelineStep) {
    // Update existing step
    if (job.status === 'dalam_proses') {
      timelineStep.startTime = new Date().toISOString();
      timelineStep.isInProgress = true;
      timelineStep.progress = job.progress || 0;
      timelineStep.employee = job.accepted_by || '';
    } else if (job.status === 'selesai') {
      timelineStep.completeTime = new Date().toISOString();
      timelineStep.isCompleted = true;
      timelineStep.isInProgress = false;
      timelineStep.progress = 100;
    }
  } else {
    // Create new step
    order.timeline.push({
      id: order.timeline.length + 1,
      department: job.department,
      label: job.department,
      description: `Proses ${job.department}`,
      startTime: job.status === 'dalam_proses' ? new Date().toISOString() : '',
      completeTime: job.status === 'selesai' ? new Date().toISOString() : '',
      isInProgress: job.status === 'dalam_proses',
      isCompleted: job.status === 'selesai',
      progress: job.progress || 0,
      employee: job.accepted_by || ''
    });
  }

  // Update order status berdasarkan progress timeline
  updateOrderStatus(order);
  
  orders[orderIndex] = order;
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const updateOrderStatus = (order) => {
  if (!order.timeline || order.timeline.length === 0) return;

  const completedSteps = order.timeline.filter(step => step.isCompleted).length;
  const totalSteps = 5; // Potong, Jahit, Finishing, Packing, QC

  if (completedSteps === totalSteps) {
    order.status = 'delivered';
  } else if (completedSteps >= 4) {
    order.status = 'completed';
  } else if (completedSteps >= 1) {
    order.status = 'production';
  }
};

export const getOrderJobs = (orderId) => {
  const allJobs = [];
  
  // Get from available jobs
  const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
  const orderAvailableJobs = availableJobs.filter(job => job.order_id === orderId);
  allJobs.push(...orderAvailableJobs);
  
  // Get from user jobs
  const users = JSON.parse(localStorage.getItem('userData') || '[]');
  users.forEach(user => {
    const userJobs = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
    const userOrderJobs = userJobs.filter(job => job.order_id === orderId);
    allJobs.push(...userOrderJobs);
  });
  
  return allJobs;
};