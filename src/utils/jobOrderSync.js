// src/utils/jobOrderSync.js
// Utilitas untuk sinkronisasi Job List dan Order

export const syncOrderWithJobs = (order) => {
  // Jika order dibatalkan, hapus semua jobs terkait
  if (order.status === 'cancelled') {
    const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
    const filteredJobs = availableJobs.filter(job => job.order_id !== order.id);
    localStorage.setItem('availableJobs', JSON.stringify(filteredJobs));
    
    // Juga hapus dari myJobs setiap user
    const users = JSON.parse(localStorage.getItem('userData') || '[]');
    users.forEach(user => {
      const userJobs = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
      const filteredUserJobs = userJobs.filter(job => job.order_id !== order.id);
      localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(filteredUserJobs));
    });
    
    return [];
  }
  
  // Generate jobs berdasarkan order
  const jobs = generateJobsFromOrder(order);
  
  // Simpan jobs ke available jobs
  const availableJobs = JSON.parse(localStorage.getItem('availableJobs') || '[]');
  
  // Filter out existing jobs for this order
  const filteredJobs = availableJobs.filter(j => j.order_id !== order.id);
  
  // Add new jobs
  const updatedJobs = [...filteredJobs, ...jobs];
  localStorage.setItem('availableJobs', JSON.stringify(updatedJobs));
  
  return jobs;
};

const getEarliestItemDeadline = (order) => {
  if (!order.itemsDetail || order.itemsDetail.length === 0) return null;
  
  let earliest = null;
  order.itemsDetail.forEach(item => {
    if (item.deadline) {
      if (!earliest || item.deadline < earliest) {
        earliest = item.deadline;
      }
    }
  });
  return earliest;
};

export const generateJobsFromOrder = (order) => {
  if (!order || order.status === 'cancelled') {
    return [];
  }

  const jobs = [];
  
  // Production steps sesuai alur baru: Potong → Jahit → Finishing → QC → Mengirim
  const productionSteps = [
    { department: 'Potong', priority: 'tinggi', order: 1, stepKey: 'cutting' },
    { department: 'Jahit', priority: 'sedang', order: 2, stepKey: 'sewing' },
    { department: 'Finishing', priority: 'sedang', order: 3, stepKey: 'finishing' },
    { department: 'QC', priority: 'tinggi', order: 4, stepKey: 'qc' },
    { department: 'Mengirim', priority: 'rendah', order: 5, stepKey: 'delivering' }
  ];

  const orderDate = new Date(order.orderDate || new Date());
  const dueDate = order.dueDate ? new Date(order.dueDate) : null;
  
  // Tentukan step mana yang perlu digenerate berdasarkan status order
  // Urutan: cutting(0) → sewing(1) → finishing(2) → qc(3) → delivering(4) → completed(5)
  const statusStepMap = {
    'cutting': [0],                    // Hanya Potong
    'sewing': [0, 1],                  // Potong, Jahit
    'finishing': [0, 1, 2],            // Potong, Jahit, Finishing
    'qc': [0, 1, 2, 3],                // Potong, Jahit, Finishing, QC
    'delivering': [0, 1, 2, 3, 4],     // Semua step produksi (Potong → Mengirim)
    'completed': [0, 1, 2, 3, 4],      // Semua step (untuk arsip)
  };
  
  const stepsToGenerate = statusStepMap[order.status] || [0];

  productionSteps.forEach((step, index) => {
    const shouldGenerate = stepsToGenerate.includes(index);
    
    if (shouldGenerate) {
      let deadline;
      if (dueDate) {
        // Hitung deadline per step berdasarkan dueDate
        const stepDeadline = new Date(dueDate);
        stepDeadline.setDate(stepDeadline.getDate() - (productionSteps.length - index));
        deadline = stepDeadline.toISOString().split('T')[0];
      } else {
        const defaultDeadline = new Date(orderDate);
        defaultDeadline.setDate(defaultDeadline.getDate() + (step.order * 2) + 1);
        deadline = defaultDeadline.toISOString().split('T')[0];
      }

      const job = {
        id: `${order.id}-${step.department}-${Date.now()}-${index}`,
        order_id: order.id,
        product_name: order.itemsDetail?.[0]?.product || 'Produk',
        qty: order.items || 0,
        status: 'menunggu',
        department: step.department,
        deadline: deadline,
        due_date: dueDate ? dueDate.toISOString().split('T')[0] : null,
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

  // Map department name untuk timeline
  const deptToLabel = {
    'Potong': 'Cutting',
    'Jahit': 'Sewing',
    'Finishing': 'Finishing',
    'QC': 'Quality Control',
    'Mengirim': 'Delivering'
  };

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
      timelineStep.duration = calculateDuration(timelineStep.startTime, timelineStep.completeTime);
    }
  } else {
    // Create new step
    order.timeline.push({
      id: order.timeline.length + 1,
      department: job.department,
      label: deptToLabel[job.department] || job.department,
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

  // Urutan step: Potong(1) → Jahit(2) → Finishing(3) → QC(4) → Mengirim(5)
  const completedSteps = order.timeline.filter(step => step.isCompleted).length;

  if (completedSteps >= 5) {
    order.status = 'delivering';
  } else if (completedSteps >= 4) {
    order.status = 'qc';
  } else if (completedSteps >= 3) {
    order.status = 'finishing';
  } else if (completedSteps >= 2) {
    order.status = 'sewing';
  } else if (completedSteps >= 1) {
    order.status = 'cutting';
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

// Helper function untuk menghitung durasi
const calculateDuration = (startTime, endTime) => {
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
      return `${diffDays} hari ${hours} jam ${minutes} menit`;
    } else if (diffHours > 0) {
      return `${diffHours} jam ${minutes} menit`;
    }
    return `${minutes} menit`;
  } catch (error) {
    return '';
  }
};