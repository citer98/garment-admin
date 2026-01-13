import React, { useState, useEffect } from 'react';
import { userData } from './UserManagement.jsx';
import { Link } from 'react-router-dom';
import { Camera, Upload, X, ZoomIn, ZoomOut, RotateCw, CheckCircle, Download, ChevronLeft, ChevronRight, Expand, Maximize2, Trash2, FileImage } from 'lucide-react';

export default function JobList() {
  const [user, setUser] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [nextHandler, setNextHandler] = useState('');
  const [showAvailableJobs, setShowAvailableJobs] = useState(true);
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // State untuk Photo Upload yang terintegrasi dengan setiap job
  const [expandedJobPhotos, setExpandedJobPhotos] = useState(null); // ID job yang foto-nya sedang dilihat
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoRotation, setPhotoRotation] = useState(0);

  // Load orders dan user data
  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      setUser(parsedUser);
      loadOrders();
    }
  }, []);

  // Auto-refresh jobs setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        loadOrders();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  const loadOrders = () => {
    try {
      const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      setOrders(savedOrders);
      
      if (user) {
        setupJobsFromOrders(savedOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    }
  };

  const setupJobsFromOrders = (orderList) => {
    if (!user || !orderList.length) {
      setAvailableJobs([]);
      setMyJobs([]);
      return;
    }

    const userDept = user.department || 'Jahit';
    const generatedJobs = [];
    const myJobsData = [];

    orderList.forEach((order, orderIndex) => {
      if (order.status === 'cancelled') return;

      const productionSteps = [
        { department: 'Potong', status: 'processing' },
        { department: 'Jahit', status: 'production' },
        { department: 'Finishing', status: 'production' },
        { department: 'Packing', status: 'completed' },
        { department: 'QC', status: 'delivered' }
      ];

      productionSteps.forEach((step, stepIndex) => {
        const shouldGenerateJob = 
          (order.status === 'processing' && stepIndex === 0) ||
          (order.status === 'production' && stepIndex <= 2) ||
          (order.status === 'completed' && stepIndex <= 3) ||
          (order.status === 'delivered' && stepIndex <= 4);

        if (shouldGenerateJob) {
          const orderDate = new Date(order.orderDate || new Date());
          const deadline = new Date(orderDate);
          deadline.setDate(deadline.getDate() + (stepIndex * 2) + 2);

          const job = {
            id: `${order.id}-${step.department}-${stepIndex}`,
            order_id: order.id,
            product_name: order.itemsDetail?.[0]?.product || 'Produk',
            qty: order.items || 0,
            status: 'menunggu',
            department: step.department,
            deadline: deadline.toISOString().split('T')[0],
            notes: order.notes || `Proses ${step.department} untuk order ${order.id}`,
            created_at: new Date().toLocaleString('id-ID'),
            complexity: order.items > 15 ? 'tinggi' : order.items > 5 ? 'sedang' : 'rendah',
            estimated_time: order.items > 15 ? '2-3 hari' : order.items > 5 ? '1-2 hari' : '1 hari',
            total_amount: order.totalAmount || 0,
            customer_name: order.customerName || 'Pelanggan',
            priority: order.priority || 'sedang',
            photos: loadJobPhotos(`${order.id}-${step.department}-${stepIndex}`)
          };

          switch(step.department) {
            case 'Potong':
              job.fabric_type = 'Katun';
              job.pattern_code = `PT-${order.id.slice(-3)}`;
              break;
            case 'Jahit':
              job.stitch_type = 'Lurus';
              job.thread_color = 'Putih';
              break;
            case 'Finishing':
              job.finishing_type = 'Standar';
              job.accessories = 'Label';
              break;
            case 'Packing':
              job.packaging_type = 'Standar';
              job.materials = 'Polybag, Label';
              break;
            case 'QC':
              job.qc_type = 'Final Check';
              job.inspector = 'QC Officer';
              break;
          }

          if (job.department === userDept) {
            const myJobsFromStorage = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
            const isJobTaken = myJobsFromStorage.some(j => j.id === job.id);

            if (!isJobTaken) {
              generatedJobs.push(job);
            } else {
              const takenJob = myJobsFromStorage.find(j => j.id === job.id);
              if (takenJob) {
                takenJob.photos = loadJobPhotos(takenJob.id);
                myJobsData.push(takenJob);
              }
            }
          }
        }
      });
    });

    setAvailableJobs(generatedJobs);
    setMyJobs(myJobsData);
    setupDepartments();
  };

  useEffect(() => {
    if (user && orders.length > 0) {
      setupJobsFromOrders(orders);
    }
  }, [user, orders]);

  // ================== PHOTO UPLOAD FUNCTIONS ==================
  
  const loadJobPhotos = (jobId) => {
    const key = `job_photos_${jobId}`;
    const photos = JSON.parse(localStorage.getItem(key) || '[]');
    return photos;
  };

  const saveJobPhotos = (jobId, photos) => {
    const key = `job_photos_${jobId}`;
    localStorage.setItem(key, JSON.stringify(photos));
    
    // Update job di myJobs state
    const updatedMyJobs = myJobs.map(job => 
      job.id === jobId ? { ...job, photos } : job
    );
    setMyJobs(updatedMyJobs);
    
    // Update di localStorage myJobs
    if (user) {
      const myJobsFromStorage = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
      const updatedStorageJobs = myJobsFromStorage.map(job => 
        job.id === jobId ? { ...job, photos } : job
      );
      localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(updatedStorageJobs));
    }
  };

  const formatDateForFileName = () => {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  const toggleJobPhotoSection = (jobId) => {
    if (expandedJobPhotos === jobId) {
      setExpandedJobPhotos(null);
    } else {
      setExpandedJobPhotos(jobId);
    }
  };
  
  // ================== END PHOTO UPLOAD FUNCTIONS ==================

  const setupDepartments = () => {
    const productionFlow = ['Potong', 'Jahit', 'Finishing', 'Packing', 'QC'];
    const activeUsers = userData.filter(u => u.status === 'active');
    
    const deptGroups = {};
    activeUsers.forEach(user => {
      if (!deptGroups[user.department]) {
        deptGroups[user.department] = [];
      }
      deptGroups[user.department].push(user);
    });
    
    setDepartments(deptGroups);
  };

  const handleAcceptJob = (job) => {
    setSelectedJob(job);
    setShowAcceptModal(true);
  };

  const confirmAcceptJob = () => {
    if (!selectedJob || !user) return;

    const updatedAvailableJobs = availableJobs.filter(j => j.id !== selectedJob.id);
    
    const jobToAccept = {
      ...selectedJob,
      status: 'dalam_proses',
      accepted_at: new Date().toLocaleString('id-ID'),
      progress: 0,
      priority: 'sedang',
      accepted_by: user.name,
      start_time: new Date().toISOString(),
      order_details: orders.find(o => o.id === selectedJob.order_id) || {},
      photos: loadJobPhotos(selectedJob.id)
    };

    const myJobsFromStorage = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
    myJobsFromStorage.push(jobToAccept);
    localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(myJobsFromStorage));

    updateOrderTimeline(selectedJob.order_id, selectedJob.department, 'started');
    
    setMyJobs([...myJobs, jobToAccept]);
    setAvailableJobs(updatedAvailableJobs);
    setSelectedJob(null);
    setShowAcceptModal(false);
    
    alert(`Pekerjaan "${selectedJob.product_name}" berhasil diambil!`);
  };

  const updateOrderTimeline = (orderId, department, action) => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = savedOrders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
      const order = savedOrders[orderIndex];
      
      if (!order.timeline) {
        order.timeline = [];
      }
      
      let timelineStep = order.timeline.find(step => step.department === department);
      
      if (!timelineStep) {
        timelineStep = {
          id: order.timeline.length + 1,
          department: department,
          status: action === 'started' ? 'processing' : 'completed',
          label: department,
          description: `Proses ${department}`,
          startTime: action === 'started' ? new Date().toISOString() : '',
          completeTime: action === 'completed' ? new Date().toISOString() : '',
          duration: '',
          isCompleted: action === 'completed',
          isInProgress: action === 'started',
          employee: user?.name || '',
          notes: `Pekerjaan ${action === 'started' ? 'dimulai' : 'diselesaikan'} oleh ${user?.name}`,
          progress: action === 'started' ? 0 : 100
        };
        order.timeline.push(timelineStep);
      } else {
        if (action === 'started') {
          timelineStep.startTime = new Date().toISOString();
          timelineStep.isInProgress = true;
          timelineStep.progress = 0;
          timelineStep.employee = user?.name || '';
        } else if (action === 'completed') {
          timelineStep.completeTime = new Date().toISOString();
          timelineStep.isCompleted = true;
          timelineStep.isInProgress = false;
          timelineStep.progress = 100;
          timelineStep.duration = calculateDuration(timelineStep.startTime, timelineStep.completeTime);
        }
      }
      
      updateOrderStatus(order);
      
      savedOrders[orderIndex] = order;
      localStorage.setItem('orders', JSON.stringify(savedOrders));
      setOrders(savedOrders);
      
      setupJobsFromOrders(savedOrders);
    }
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours} jam ${diffMinutes} menit`;
    }
    return `${diffMinutes} menit`;
  };

  const updateOrderStatus = (order) => {
    if (!order.timeline || order.timeline.length === 0) return;
    
    const completedSteps = order.timeline.filter(step => step.isCompleted).length;
    const totalSteps = order.timeline.length;
    
    if (completedSteps === totalSteps) {
      order.status = 'delivered';
    } else if (completedSteps >= totalSteps * 0.75) {
      order.status = 'completed';
    } else if (completedSteps >= totalSteps * 0.5) {
      order.status = 'production';
    } else if (completedSteps > 0) {
      order.status = 'processing';
    }
  };

  const handleHandover = (job) => {
    setSelectedJob(job);
    setShowHandoverModal(true);
  };

  const submitHandover = () => {
    if (!selectedJob || !nextHandler || !user) {
      alert('Pilih penerima terlebih dahulu!');
      return;
    }

    const receivingUser = userData.find(u => u.id.toString() === nextHandler);
    
    if (!receivingUser) {
      alert('Penerima tidak ditemukan!');
      return;
    }

    const handoverLog = {
      job_id: selectedJob.id,
      order_id: selectedJob.order_id,
      from_user: user.name,
      from_dept: user.department,
      to_user: receivingUser.name,
      to_dept: receivingUser.department,
      timestamp: new Date().toISOString(),
      notes: `Diserahkan dari ${user.department} ke ${receivingUser.department}`
    };

    const handoverLogs = JSON.parse(localStorage.getItem('handoverLogs') || '[]');
    handoverLogs.push(handoverLog);
    localStorage.setItem('handoverLogs', JSON.stringify(handoverLogs));

    const updatedMyJobs = myJobs.filter(job => job.id !== selectedJob.id);
    const myJobsFromStorage = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
    const filteredMyJobs = myJobsFromStorage.filter(j => j.id !== selectedJob.id);
    localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(filteredMyJobs));

    const newJobForReceiver = {
      ...selectedJob,
      status: 'menunggu',
      accepted_at: '',
      progress: 0,
      accepted_by: '',
      start_time: '',
      notes: `Diserahkan dari ${user.name} (${user.department})`,
      photos: loadJobPhotos(selectedJob.id)
    };

    const receiverJobs = JSON.parse(localStorage.getItem(`myJobs_${receivingUser.id}`) || '[]');
    receiverJobs.push(newJobForReceiver);
    localStorage.setItem(`myJobs_${receivingUser.id}`, JSON.stringify(receiverJobs));

    updateOrderTimeline(selectedJob.order_id, selectedJob.department, 'completed');

    setMyJobs(updatedMyJobs);
    setSelectedJob(null);
    setNextHandler('');
    setShowHandoverModal(false);
    
    alert(`✅ Pekerjaan berhasil diserahkan ke ${receivingUser.name} (${receivingUser.department})!`);
  };

  const updateProgress = (jobId, progress) => {
    const updatedMyJobs = myJobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            progress: Math.min(100, Math.max(0, progress)),
            last_updated: new Date().toLocaleString('id-ID')
          }
        : job
    );
    
    setMyJobs(updatedMyJobs);
    
    if (user) {
      const myJobsFromStorage = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
      const updatedStorageJobs = myJobsFromStorage.map(job => 
        job.id === jobId 
          ? { ...job, progress: Math.min(100, Math.max(0, progress)), last_updated: new Date().toLocaleString('id-ID') }
          : job
      );
      localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(updatedStorageJobs));
    }
  };

  const completeJob = (jobId) => {
    const job = myJobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (window.confirm(`Tandai pekerjaan "${job.product_name}" sebagai selesai?`)) {
      const updatedMyJobs = myJobs.map(j => 
        j.id === jobId 
          ? { 
              ...j, 
              status: 'selesai', 
              progress: 100, 
              completed_at: new Date().toLocaleString('id-ID'),
              end_time: new Date().toISOString()
            }
          : j
      );
      
      setMyJobs(updatedMyJobs);
      
      if (user) {
        const myJobsFromStorage = JSON.parse(localStorage.getItem(`myJobs_${user.id}`) || '[]');
        const updatedStorageJobs = myJobsFromStorage.map(j => 
          j.id === jobId 
            ? { 
                ...j, 
                status: 'selesai', 
                progress: 100, 
                completed_at: new Date().toLocaleString('id-ID'),
                end_time: new Date().toISOString()
              }
            : j
        );
        localStorage.setItem(`myJobs_${user.id}`, JSON.stringify(updatedStorageJobs));
      }
      
      updateOrderTimeline(job.order_id, job.department, 'completed');
      
      alert('🎉 Pekerjaan telah diselesaikan!');
    }
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Potong': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Jahit': 'bg-green-100 text-green-800 border border-green-200',
      'Finishing': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Packing': 'bg-purple-100 text-purple-800 border border-purple-200',
      'QC': 'bg-red-100 text-red-800 border border-red-200',
      'Management': 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return colors[dept] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'menunggu': 
        return 'bg-gray-100 text-gray-800 border border-gray-300';
      case 'dalam_proses': 
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'selesai': 
        return 'bg-green-100 text-green-800 border border-green-300';
      default: 
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextDepartments = (currentDept) => {
    const flow = {
      'Potong': ['Jahit', 'QC'],
      'Jahit': ['Finishing', 'QC'],
      'Finishing': ['Packing', 'QC'],
      'Packing': ['QC'],
      'QC': ['Selesai']
    };
    return flow[currentDept] || [];
  };

  const getOrderDetails = (orderId) => {
    return orders.find(o => o.id === orderId);
  };

  // ================== PHOTO UPLOAD COMPONENT (INTEGRATED) ==================
  const JobPhotoSection = ({ job }) => {
    const [photos, setPhotos] = useState(job.photos || []);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = React.useRef(null);
    const previewRef = React.useRef(null);
    const [newDescription, setNewDescription] = useState('');

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diizinkan!');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }

      if (photos.length >= 10) {
        alert('Maksimal 10 foto untuk progress ini!');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview({
          url: e.target.result,
          name: file.name,
          size: file.size,
          type: file.type,
          description: ''
        });
      };
      reader.readAsDataURL(file);
    };

    const simulateUpload = (fileData) => {
      setUploading(true);
      setProgress(0);

      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 10;
        });
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setProgress(100);

        const newPhoto = {
          id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: fileData.url,
          name: `progress_${job.department}_${job.order_id}_${formatDateForFileName()}.jpg`,
          timestamp: new Date().toISOString(),
          department: job.department,
          uploadedBy: user?.name || 'Current User',
          size: fileData.size,
          description: fileData.description || '',
          status: 'uploaded'
        };

        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        saveJobPhotos(job.id, updatedPhotos);
        setPreview(null);
        setNewDescription('');

        setTimeout(() => {
          setUploading(false);
          setProgress(0);
          alert('Foto berhasil diupload!');
        }, 500);
      }, 1500);
    };

    const handleUpload = () => {
      if (!preview) return;
      simulateUpload(preview);
    };

    const handleRemovePhoto = (photoId) => {
      if (window.confirm('Hapus foto ini?')) {
        const updatedPhotos = photos.filter(photo => photo.id !== photoId);
        setPhotos(updatedPhotos);
        saveJobPhotos(job.id, updatedPhotos);
      }
    };

    const handleAddDescription = (photoId, description) => {
      const updatedPhotos = photos.map(photo => 
        photo.id === photoId ? { ...photo, description } : photo
      );
      setPhotos(updatedPhotos);
      saveJobPhotos(job.id, updatedPhotos);
    };

    const triggerFileInput = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const openPhotoPreview = (photo) => {
      setSelectedPhoto(photo);
      setPhotoZoom(1);
      setPhotoRotation(0);
      setShowPhotoPreview(true);
    };

    return (
      <div className="mt-6 border-t border-gray-200 pt-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Camera className="text-blue-600 mr-3" size={24} />
            <div>
              <h4 className="font-bold text-lg text-gray-800">Photo Progress Tracking</h4>
              <p className="text-sm text-gray-600">Dokumentasikan progress produksi dengan foto</p>
            </div>
          </div>
          <button
            onClick={() => toggleJobPhotoSection(job.id)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Upload Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <div className="text-blue-600 text-2xl font-bold mb-1">{photos.length}</div>
            <div className="text-sm text-blue-800">Total Foto</div>
            <div className="text-xs text-blue-600 mt-1">Max: 10 foto</div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <div className="text-green-600 text-2xl font-bold mb-1">
              {photos.filter(p => p.description).length}
            </div>
            <div className="text-sm text-green-800">Dengan Deskripsi</div>
            <div className="text-xs text-green-600 mt-1">Ter-dokumentasi</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
            <div className="text-purple-600 text-2xl font-bold mb-1">
              {photos.length > 0 ? formatDateTime(photos[photos.length-1].timestamp) : '-'}
            </div>
            <div className="text-sm text-purple-800">Upload Terakhir</div>
            <div className="text-xs text-purple-600 mt-1">Waktu terakhir</div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-8 border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-400 transition-colors">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="text-blue-600" size={24} />
            </div>
            
            <h4 className="font-medium text-gray-800 mb-2">
              Upload Foto Progress Produksi
            </h4>
            
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              Unggah foto kondisi aktual produksi. Format: JPG, PNG (maks. 5MB per file)
            </p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
              capture="environment"
            />
            
            <button
              onClick={triggerFileInput}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center mx-auto"
              disabled={uploading || photos.length >= 10}
            >
              <Camera size={18} className="mr-2" />
              {uploading ? 'Uploading...' : 'Ambil/Gunakan Foto'}
            </button>
            
            <p className="text-xs text-gray-500 mt-3">
              Klik untuk mengambil foto baru atau pilih dari galeri
            </p>
          </div>
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="mb-8 bg-white rounded-xl border border-gray-200 p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-800">Preview Foto</h4>
              <button
                onClick={() => setPreview(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img
                    ref={previewRef}
                    src={preview.url}
                    alt="Preview"
                    className="w-full h-64 object-contain bg-gray-50"
                  />
                </div>
                
                <div className="mt-3 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      if (previewRef.current) {
                        previewRef.current.requestFullscreen();
                      }
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    title="Zoom"
                  >
                    <ZoomIn size={16} className="inline mr-1" />
                    Fullscreen
                  </button>
                  <button
                    onClick={() => {
                      setPreview(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    title="Ambil Ulang"
                  >
                    <RotateCw size={16} className="inline mr-1" />
                    Ambil Ulang
                  </button>
                </div>
              </div>
              
              <div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama File
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                      value={`progress_${job.department}_${formatDateForFileName()}`}
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ukuran
                      </label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {formatFileSize(preview.size)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format
                      </label>
                      <div className="p-3 border border-gray-300 rounded-lg bg-gray-50">
                        {preview.type.split('/')[1].toUpperCase()}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi (Opsional)
                    </label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows="3"
                      placeholder="Tambahkan deskripsi foto..."
                      value={newDescription}
                      onChange={(e) => {
                        setNewDescription(e.target.value);
                        setPreview(prev => ({...prev, description: e.target.value}));
                      }}
                    />
                  </div>
                  
                  {/* Upload Progress */}
                  {uploading && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-700 mb-1">
                        <span>Mengupload...</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      uploading
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading... {progress}%
                      </>
                    ) : (
                      <>
                        <Upload size={18} className="mr-2" />
                        Upload Foto Progress
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {photos.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-gray-800">
                Gallery Foto ({photos.length})
              </h4>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500 mr-1" />
                Tersimpan di browser
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  {/* Photo */}
                  <div className="relative h-48 bg-gray-100 cursor-pointer group" onClick={() => openPhotoPreview(photo)}>
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(photo.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Hapus foto"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <p className="text-white text-xs font-medium truncate">
                        {formatDateTime(photo.timestamp)}
                      </p>
                      <p className="text-white/80 text-xs truncate">
                        {photo.uploadedBy}
                      </p>
                    </div>
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                        {formatFileSize(photo.size)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Photo Info */}
                  <div className="p-3">
                    <div className="mb-2">
                      <label className="block text-xs text-gray-500 mb-1">
                        Deskripsi:
                      </label>
                      <textarea
                        className="w-full p-2 text-sm border border-gray-200 rounded resize-none"
                        rows="2"
                        placeholder="Tambahkan deskripsi..."
                        value={photo.description || ''}
                        onChange={(e) => handleAddDescription(photo.id, e.target.value)}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <div className="flex items-center">
                        <Camera size={12} className="mr-1" />
                        {photo.department}
                      </div>
                      <button
                        onClick={() => openPhotoPreview(photo)}
                        className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                      >
                        <Expand size={12} className="mr-1" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
            <FileImage size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Belum ada foto</p>
            <p className="text-gray-400 text-sm mt-2">
              Upload foto pertama Anda untuk mendokumentasikan progress produksi
            </p>
          </div>
        )}

        {/* Guidelines */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h5 className="font-medium text-blue-800 mb-2 flex items-center">
            <Camera size={16} className="mr-2" />
            Tips Foto Dokumentasi
          </h5>
          <ul className="text-sm text-blue-700 space-y-1 list-disc pl-5">
            <li>Pastikan pencahayaan cukup untuk foto yang jelas</li>
            <li>Fokus pada area produksi yang sedang dikerjakan</li>
            <li>Tambahkan deskripsi untuk konteks yang lebih baik</li>
            <li>Foto akan tersimpan secara otomatis di browser</li>
            <li>Maksimal 10 foto per pekerjaan</li>
          </ul>
        </div>
      </div>
    );
  };

  // ================== PHOTO PREVIEW MODAL ==================
  const PhotoPreviewModal = () => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [allPhotos, setAllPhotos] = useState([]);
    const [currentJob, setCurrentJob] = useState(null);

    useEffect(() => {
      if (selectedPhoto && expandedJobPhotos) {
        const job = myJobs.find(j => j.id === expandedJobPhotos);
        if (job) {
          setCurrentJob(job);
          const photos = job.photos || [];
          setAllPhotos(photos);
          const index = photos.findIndex(p => p.id === selectedPhoto.id);
          setCurrentPhotoIndex(index >= 0 ? index : 0);
        }
      }
    }, [selectedPhoto, expandedJobPhotos, myJobs]);

    if (!showPhotoPreview || !selectedPhoto || !currentJob) return null;

    const currentPhoto = allPhotos[currentPhotoIndex] || selectedPhoto;

    const handlePrev = () => {
      setCurrentPhotoIndex(prev => prev === 0 ? allPhotos.length - 1 : prev - 1);
      resetPhotoView();
    };

    const handleNext = () => {
      setCurrentPhotoIndex(prev => prev === allPhotos.length - 1 ? 0 : prev + 1);
      resetPhotoView();
    };

    const resetPhotoView = () => {
      setPhotoZoom(1);
      setPhotoRotation(0);
    };

    const handleZoomIn = () => {
      setPhotoZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
      setPhotoZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
      setPhotoRotation(prev => (prev + 90) % 360);
    };

    const handleDownload = () => {
      const link = document.createElement('a');
      link.href = currentPhoto.url;
      link.download = currentPhoto.name || 'photo.jpg';
      link.click();
    };

    return (
      <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center text-white mb-4">
            <div>
              <h3 className="text-lg font-semibold">Photo Preview</h3>
              <p className="text-sm text-gray-300">
                {currentJob.product_name} • {currentPhotoIndex + 1} dari {allPhotos.length} • 
                {formatDateTime(currentPhoto.timestamp)}
              </p>
            </div>
            <button
              onClick={() => {
                setShowPhotoPreview(false);
                setSelectedPhoto(null);
                resetPhotoView();
              }}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-6">
            <div className="flex-1 relative bg-gray-900 rounded-xl overflow-hidden">
              <img
                src={currentPhoto.url}
                alt="Preview"
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${photoZoom}) rotate(${photoRotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
              />
              
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  disabled={photoZoom >= 3}
                >
                  <ZoomIn size={20} />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  disabled={photoZoom <= 0.5}
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={handleRotate}
                  className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                >
                  <Download size={20} />
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 bg-gray-800 rounded-xl p-4">
              <div className="mb-6">
                <h4 className="text-white font-medium mb-2">Info Foto</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-400">Pekerjaan:</span>
                    <p className="font-medium">{currentJob.product_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Upload oleh:</span>
                    <p>{currentPhoto.uploadedBy}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Departemen:</span>
                    <p>{currentPhoto.department}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Waktu:</span>
                    <p>{formatDateTime(currentPhoto.timestamp)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ukuran:</span>
                    <p>{formatFileSize(currentPhoto.size)}</p>
                  </div>
                </div>
              </div>

              {currentPhoto.description && (
                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">Deskripsi</h4>
                  <p className="text-sm text-gray-300 bg-gray-700/50 p-3 rounded">
                    {currentPhoto.description}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-white font-medium mb-2">Navigasi Foto</h4>
                <div className="flex space-x-2 overflow-x-auto py-2">
                  {allPhotos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => {
                        setCurrentPhotoIndex(index);
                        resetPhotoView();
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        index === currentPhotoIndex 
                          ? 'border-blue-500' 
                          : 'border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      <img
                        src={photo.url}
                        alt={`Thumb ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Sistem Pekerjaan Departemen</h2>
            <p className="text-gray-600">Kelola pekerjaan produksi berdasarkan order</p>
          </div>
          <Link
            to="/orders"
            className="flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            📋 Lihat Semua Order
          </Link>
        </div>
        
        <div className="flex items-center bg-gradient-to-r from-blue-50 to-gray-50 p-4 rounded-lg border border-blue-100 mt-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4 shadow-sm">
            <span className="text-white font-bold text-lg">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <p className="font-semibold text-gray-800 text-lg">{user?.name || 'User'}</p>
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-bold ${getDepartmentColor(user?.department)}`}>
                {user?.department || 'Belum ditentukan'}
              </span>
            </div>
            <div className="mt-1 text-sm text-gray-600">
              <span className="font-medium">Username:</span> {user?.username} | 
              <span className="font-medium ml-3">Role:</span> {user?.role} |
              <span className="font-medium ml-3">Total Order Aktif:</span> {orders.filter(o => !['cancelled', 'delivered'].includes(o.status)).length}
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Tabs - SIMPLIFIED */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setShowAvailableJobs(true)}
          className={`px-6 py-3 font-medium text-sm flex items-center ${showAvailableJobs ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <span className="mr-2">📋</span>
          Pekerjaan Tersedia 
          {availableJobs.length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
              {availableJobs.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowAvailableJobs(false)}
          className={`px-6 py-3 font-medium text-sm flex items-center ${!showAvailableJobs ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <span className="mr-2">👨‍💼</span>
          Pekerjaan Saya
          {myJobs.length > 0 && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
              {myJobs.length}
            </span>
          )}
          {myJobs.reduce((total, job) => total + (job.photos?.length || 0), 0) > 0 && (
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
              📸 {myJobs.reduce((total, job) => total + (job.photos?.length || 0), 0)}
            </span>
          )}
        </button>
      </div>

      {/* Pekerjaan Tersedia - TIDAK BERUBAH */}
      {showAvailableJobs && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Pekerjaan yang Tersedia untuk Departemen{' '}
                <span className="text-blue-600">{user?.department || 'Anda'}</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Ambil pekerjaan sesuai dengan keahlian dan kapasitas Anda
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to={`/orders/${availableJobs[0]?.order_id || ''}`}
                className={`text-blue-600 hover:text-blue-800 text-sm font-medium ${!availableJobs[0] && 'opacity-50 cursor-not-allowed'}`}
              >
                🔗 Lihat Detail Order
              </Link>
              <button 
                onClick={loadOrders}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              >
                ⟳ Refresh daftar
              </button>
            </div>
          </div>
          
          {availableJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableJobs.map(job => {
                const orderDetails = getOrderDetails(job.order_id);
                return (
                  <div key={job.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow duration-300 bg-white">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getDepartmentColor(job.department)}`}>
                          {job.department}
                        </span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                          job.complexity === 'tinggi' ? 'bg-red-100 text-red-800' :
                          job.complexity === 'sedang' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {job.complexity.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          {job.created_at}
                        </div>
                        <Link
                          to={`/orders/${job.order_id}`}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-1 block"
                        >
                          ↗ Order Detail
                        </Link>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold border border-blue-200">
                          {job.order_id}
                        </span>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-800">{job.product_name}</h4>
                          <p className="text-xs text-gray-600">Pelanggan: {orderDetails?.customerName || job.customer_name}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500 text-xs">Jumlah</div>
                          <div className="font-bold text-gray-800">{job.qty} pcs</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500 text-xs">Estimasi</div>
                          <div className="font-bold text-gray-800">{job.estimated_time}</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Deadline:</span>
                          <span className="font-bold text-gray-800">{job.deadline}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (Date.now() - new Date(job.deadline).getTime()) / (1000 * 60 * 60 * 24) * 10)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {orderDetails?.totalAmount && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Nilai Order: </span>
                          Rp {orderDetails.totalAmount.toLocaleString('id-ID')}
                        </div>
                      )}
                      
                      {job.notes && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-start">
                            <span className="text-yellow-600 mr-2">📝</span>
                            <div>
                              <div className="text-xs font-medium text-yellow-800">Catatan Khusus:</div>
                              <div className="text-sm text-yellow-700">{job.notes}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAcceptJob(job)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      👨‍🏭 Ambil Pekerjaan Ini
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="text-gray-400 mb-3 text-5xl">🎯</div>
              <p className="text-gray-500 font-medium text-lg">Semua pekerjaan sudah diambil</p>
              <p className="text-gray-400 text-sm mt-2">
                Tidak ada pekerjaan tersedia untuk departemen {user?.department} saat ini
              </p>
              <Link 
                to="/orders"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ↗ Lihat Daftar Order
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Pekerjaan Saya - DENGAN INTEGRASI PHOTO UPLOAD */}
      {!showAvailableJobs && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Pekerjaan yang Sedang Dikerjakan
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Kelola progress, foto dokumentasi, dan serah terima pekerjaan Anda
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Total: <span className="font-bold text-gray-800">{myJobs.length}</span> pekerjaan
              </span>
              {myJobs.some(j => j.status === 'dalam_proses') && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                  {myJobs.filter(j => j.status === 'dalam_proses').length} dalam proses
                </span>
              )}
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center">
                <Camera size={12} className="mr-1" />
                {myJobs.reduce((total, job) => total + (job.photos?.length || 0), 0)} foto
              </span>
            </div>
          </div>
          
          {myJobs.length > 0 ? (
            <div className="space-y-6">
              {myJobs.map(job => {
                const orderDetails = getOrderDetails(job.order_id);
                const hasPhotos = job.photos && job.photos.length > 0;
                
                return (
                  <div key={job.id} className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {/* Job Header */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className={`px-4 py-2 rounded-lg font-bold ${getStatusBadge(job.status)}`}>
                            {job.status === 'selesai' ? '✅ SELESAI' : 
                             job.status === 'dalam_proses' ? '🔄 DALAM PROSES' : '⏳ MENUNGGU'}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold">
                                {job.order_id}
                              </span>
                              <div>
                                <h3 className="font-bold text-lg text-gray-800">{job.product_name}</h3>
                                {orderDetails?.customerName && (
                                  <p className="text-sm text-gray-600">Pelanggan: {orderDetails.customerName}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              Diambil pada: <span className="font-medium">{job.accepted_at}</span>
                              {hasPhotos && (
                                <span className="ml-3 inline-flex items-center text-blue-600">
                                  <Camera size={14} className="mr-1" />
                                  {job.photos.length} foto
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Departemen</div>
                          <div className={`px-3 py-1 rounded text-sm font-bold ${getDepartmentColor(job.department)}`}>
                            {job.department}
                          </div>
                          <div className="mt-2 space-x-2">
                            <Link
                              to={`/orders/${job.order_id}`}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              ↗ Order
                            </Link>
                            {job.status === 'dalam_proses' && (
                              <button
                                onClick={() => toggleJobPhotoSection(job.id)}
                                className="text-xs text-green-600 hover:text-green-800 flex items-center ml-2"
                              >
                                <Camera size={12} className="mr-1" />
                                {expandedJobPhotos === job.id ? 'Tutup Foto' : 'Upload Foto'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Content */}
                    <div className="p-5">
                      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-gray-500 text-xs mb-1">Jumlah</div>
                          <div className="font-bold text-gray-800 text-lg">{job.qty} pcs</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-gray-500 text-xs mb-1">Deadline</div>
                          <div className="font-bold text-gray-800 text-lg">{job.deadline}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-gray-500 text-xs mb-1">Prioritas</div>
                          <div className={`font-bold text-lg ${
                            job.priority === 'tinggi' ? 'text-red-600' :
                            job.priority === 'sedang' ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {job.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border">
                          <div className="text-gray-500 text-xs mb-1">Progress</div>
                          <div className="font-bold text-gray-800 text-lg">{job.progress}%</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 font-medium">Progress Pengerjaan</span>
                          <span className="font-bold text-blue-600">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full transition-all duration-500 ${
                              job.progress < 30 ? 'bg-red-500' :
                              job.progress < 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-center space-x-3 mt-3">
                          <button 
                            onClick={() => updateProgress(job.id, job.progress - 10)}
                            disabled={job.progress <= 0}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            -10%
                          </button>
                          <button 
                            onClick={() => updateProgress(job.id, job.progress + 10)}
                            disabled={job.progress >= 100}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +10%
                          </button>
                          <button 
                            onClick={() => updateProgress(job.id, job.progress + 25)}
                            disabled={job.progress >= 100}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            +25%
                          </button>
                        </div>
                      </div>
                      
                      {/* Photo Quick Preview (jika ada foto) */}
                      {hasPhotos && expandedJobPhotos !== job.id && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Camera size={18} className="text-blue-600 mr-2" />
                              <h4 className="font-medium text-gray-800">Foto Progress ({job.photos.length})</h4>
                            </div>
                            <button
                              onClick={() => toggleJobPhotoSection(job.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Expand size={14} className="mr-1" />
                              Lihat Semua
                            </button>
                          </div>
                          <div className="flex space-x-3 overflow-x-auto pb-2">
                            {job.photos.slice(0, 3).map((photo, index) => (
                              <div key={photo.id} className="flex-shrink-0 w-24 h-24 relative">
                                <img
                                  src={photo.url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                                  onClick={() => {
                                    setExpandedJobPhotos(job.id);
                                    openPhotoPreview(photo);
                                  }}
                                />
                                {index === 2 && job.photos.length > 3 && (
                                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      +{job.photos.length - 3}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {job.notes && (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-start">
                            <span className="text-gray-500 mr-3">📌</span>
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Catatan Pengerjaan</div>
                              <div className="text-gray-600">{job.notes}</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex justify-between pt-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => completeJob(job.id)}
                            disabled={job.status === 'selesai'}
                            className={`px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center ${
                              job.status === 'selesai' 
                                ? 'bg-green-100 text-green-800 cursor-default' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {job.status === 'selesai' ? '✅ Selesai' : '✓ Tandai Selesai'}
                          </button>
                          <button
                            onClick={() => handleHandover(job)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 flex items-center"
                          >
                            📤 Serah Terima
                          </button>
                          {job.status === 'dalam_proses' && (
                            <button
                              onClick={() => toggleJobPhotoSection(job.id)}
                              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-semibold hover:from-green-600 hover:to-green-700 flex items-center"
                            >
                              <Camera size={16} className="mr-2" />
                              {expandedJobPhotos === job.id ? 'Tutup Foto' : 'Upload Foto'}
                            </button>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Terakhir diperbarui:<br/>
                            <span className="font-medium text-gray-700">{job.last_updated || 'Belum ada update'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Photo Upload Section */}
                    {expandedJobPhotos === job.id && (
                      <JobPhotoSection job={job} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="text-gray-400 mb-3 text-5xl">📂</div>
              <p className="text-gray-500 font-medium text-lg">Belum ada pekerjaan yang diambil</p>
              <p className="text-gray-400 text-sm mt-2">
                Ambil pekerjaan dari tab "Pekerjaan Tersedia" untuk memulai
              </p>
              <button 
                onClick={() => setShowAvailableJobs(true)}
                className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Lihat Pekerjaan Tersedia
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Ambil Pekerjaan */}
      {showAcceptModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Konfirmasi Ambil Pekerjaan</h3>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setShowAcceptModal(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-gray-50 rounded-xl border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg text-gray-800">{selectedJob.product_name}</h4>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${getDepartmentColor(selectedJob.department)}`}>
                  {selectedJob.department}
                </span>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-bold text-gray-800">
                    <Link to={`/orders/${selectedJob.order_id}`} className="text-blue-600 hover:text-blue-800">
                      {selectedJob.order_id} ↗
                    </Link>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-bold text-gray-800">{selectedJob.qty} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-bold text-gray-800">{selectedJob.deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimasi Waktu:</span>
                  <span className="font-bold text-gray-800">{selectedJob.estimated_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tingkat Kesulitan:</span>
                  <span className={`font-bold ${
                    selectedJob.complexity === 'tinggi' ? 'text-red-600' :
                    selectedJob.complexity === 'sedang' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {selectedJob.complexity.toUpperCase()}
                  </span>
                </div>
              </div>
              
              {selectedJob.notes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xs font-medium text-yellow-800 mb-1">Catatan Khusus:</div>
                  <div className="text-sm text-yellow-700">{selectedJob.notes}</div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Konfirmasi untuk mengambil pekerjaan ini:
              </label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="confirm-time" 
                    className="rounded text-blue-600 mr-3" 
                    defaultChecked 
                  />
                  <label htmlFor="confirm-time" className="text-sm text-gray-700">
                    Saya mampu menyelesaikan dalam waktu {selectedJob.estimated_time}
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="confirm-quality" 
                    className="rounded text-blue-600 mr-3" 
                    defaultChecked 
                  />
                  <label htmlFor="confirm-quality" className="text-sm text-gray-700">
                    Saya akan menjaga kualitas sesuai standar
                  </label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="confirm-deadline" 
                    className="rounded text-blue-600 mr-3" 
                    defaultChecked 
                  />
                  <label htmlFor="confirm-deadline" className="text-sm text-gray-700">
                    Saya selesai sebelum deadline {selectedJob.deadline}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setShowAcceptModal(false);
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Batalkan
              </button>
              <button
                onClick={confirmAcceptJob}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 shadow-md"
              >
                👨‍🏭 Ambil Pekerjaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Serah Terima */}
      {showHandoverModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Serah Terima Pekerjaan</h3>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setNextHandler('');
                  setShowHandoverModal(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6 p-5 bg-gray-50 rounded-xl border">
              <div className="font-bold text-lg text-gray-800 mb-2">{selectedJob.product_name}</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500">Order ID</div>
                  <div className="font-medium">
                    <Link to={`/orders/${selectedJob.order_id}`} className="text-blue-600 hover:text-blue-800">
                      {selectedJob.order_id} ↗
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Jumlah</div>
                  <div className="font-medium">{selectedJob.qty} pcs</div>
                </div>
                <div>
                  <div className="text-gray-500">Progress</div>
                  <div className="font-bold text-blue-600">{selectedJob.progress}%</div>
                </div>
                <div>
                  <div className="text-gray-500">Departemen Saat Ini</div>
                  <div className={`px-2 py-1 rounded text-xs font-bold inline-block ${getDepartmentColor(selectedJob.department)}`}>
                    {selectedJob.department}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serahkan Kepada Departemen Berikutnya:
              </label>
              
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-sm font-medium text-blue-800 mb-2">Alur Produksi:</div>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${getDepartmentColor(user?.department)}`}>
                      {user?.department?.charAt(0)}
                    </div>
                    <div className="text-xs mt-1 font-medium">{user?.department}</div>
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="text-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto bg-gray-100">
                      ?
                    </div>
                    <div className="text-xs mt-1">Penerima</div>
                  </div>
                </div>
              </div>
              
              <select
                className="w-full border p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={nextHandler}
                onChange={(e) => setNextHandler(e.target.value)}
              >
                <option value="">-- Pilih Penerima --</option>
                {getNextDepartments(user?.department).map(nextDept => (
                  <optgroup key={nextDept} label={`Departemen ${nextDept}`}>
                    {departments[nextDept]?.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} - {employee.username} ({employee.department})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              
              <p className="text-xs text-gray-500 mt-3">
                * Pilih karyawan dari departemen berikutnya sesuai alur produksi
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setNextHandler('');
                  setShowHandoverModal(false);
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Batalkan
              </button>
              <button
                onClick={submitHandover}
                className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800"
                disabled={!nextHandler}
              >
                📤 Konfirmasi Serah Terima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Statistik Ringkasan */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800">📊 Ringkasan Pekerjaan & Order</h4>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAvailableJobs(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Lihat Tersedia ↗
            </button>
            <button
              onClick={() => setShowAvailableJobs(false)}
              className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center"
            >
              <Camera size={14} className="mr-1" />
              Foto Progress ↗
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{availableJobs.length}</div>
            <div className="text-sm text-gray-600">Pekerjaan Tersedia</div>
            <div className="text-xs text-gray-400 mt-1">Menunggu diambil</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{myJobs.length}</div>
            <div className="text-sm text-gray-600">Dalam Proses</div>
            <div className="text-xs text-gray-400 mt-1">Sedang dikerjakan</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {myJobs.reduce((total, job) => total + (job.photos?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Foto</div>
            <div className="text-xs text-gray-400 mt-1">Dokumentasi visual</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {orders.filter(o => o.status === 'production').length}
            </div>
            <div className="text-sm text-gray-600">Dalam Produksi</div>
            <div className="text-xs text-gray-400 mt-1">Sedang diproses</div>
          </div>
        </div>
        
        {myJobs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">Progress Keseluruhan Departemen</div>
              <div className="text-sm font-bold text-blue-600">
                {Math.round(myJobs.reduce((sum, job) => sum + job.progress, 0) / myJobs.length)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full"
                style={{ 
                  width: `${myJobs.reduce((sum, job) => sum + job.progress, 0) / myJobs.length}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>📸 {myJobs.filter(j => j.photos && j.photos.length > 0).length} pekerjaan memiliki foto</span>
              <span>{myJobs.filter(j => j.status === 'dalam_proses').length} dalam proses</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Petunjuk */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <div className="flex items-start">
          <span className="text-yellow-600 mr-3 text-lg">💡</span>
          <div>
            <div className="font-medium text-yellow-800 mb-1">Petunjuk Penggunaan:</div>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>1. Ambil pekerjaan di tab <strong>"Pekerjaan Tersedia"</strong> sesuai departemen Anda</div>
              <div>2. Upload foto progress langsung di setiap pekerjaan dengan tombol <strong>"Upload Foto"</strong></div>
              <div>3. Update progress dan klik <strong>"Tandai Selesai"</strong> ketika pekerjaan selesai</div>
              <div>4. Gunakan <strong>"Serah Terima"</strong> untuk meneruskan ke departemen berikutnya</div>
              <div>5. Foto tersimpan di browser dan bisa dilihat/dihapus kapan saja</div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Preview Modal */}
      <PhotoPreviewModal />
    </div>
  );

  // Helper function to open photo preview
  function openPhotoPreview(photo) {
    setSelectedPhoto(photo);
    setPhotoZoom(1);
    setPhotoRotation(0);
    setShowPhotoPreview(true);
  }
}