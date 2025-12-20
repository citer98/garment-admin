import React, { useState, useEffect } from 'react';
import { userData } from './UserManagement'; // Import data user

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

  // Data simulasi pekerjaan yang tersedia berdasarkan departemen
  const allAvailableJobs = [
    {
      id: 1,
      order_id: 'ORD-001',
      product_name: 'Kemeja Pria Slimfit',
      qty: 10,
      status: 'menunggu',
      department: 'Potong',
      deadline: '2024-01-20',
      notes: 'Potong dengan pola standar',
      created_at: '2024-01-15 08:00',
      complexity: 'sedang',
      estimated_time: '1 hari',
      fabric_type: 'Katun',
      pattern_code: 'PT-001'
    },
    {
      id: 2,
      order_id: 'ORD-002',
      product_name: 'Jaket Hoodie',
      qty: 5,
      status: 'menunggu',
      department: 'Potong',
      deadline: '2024-01-18',
      notes: 'Potong bagian depan dan belakang',
      created_at: '2024-01-15 09:30',
      complexity: 'tinggi',
      estimated_time: '2 hari',
      fabric_type: 'Fleece',
      pattern_code: 'PT-002'
    },
    {
      id: 3,
      order_id: 'ORD-001',
      product_name: 'Kemeja Pria Slimfit',
      qty: 10,
      status: 'menunggu',
      department: 'Jahit',
      deadline: '2024-01-22',
      notes: 'Jahit dengan presisi tinggi',
      created_at: '2024-01-15 10:15',
      complexity: 'sedang',
      estimated_time: '2 hari',
      stitch_type: 'Lurus',
      thread_color: 'Putih'
    },
    {
      id: 4,
      order_id: 'ORD-003',
      product_name: 'Celana Jeans Denim',
      qty: 15,
      status: 'menunggu',
      department: 'Jahit',
      deadline: '2024-01-25',
      notes: 'Perkuat jahitan saku',
      created_at: '2024-01-15 11:00',
      complexity: 'tinggi',
      estimated_time: '3 hari',
      stitch_type: 'Overlock',
      thread_color: 'Biru'
    },
    {
      id: 5,
      order_id: 'ORD-002',
      product_name: 'Jaket Hoodie',
      qty: 5,
      status: 'menunggu',
      department: 'Finishing',
      deadline: '2024-01-19',
      notes: 'Rapikan jahitan dan pasang resleting',
      created_at: '2024-01-15 13:45',
      complexity: 'sedang',
      estimated_time: '1 hari',
      finishing_type: 'Jahitan Tangan',
      accessories: 'Resleting, Label'
    },
    {
      id: 6,
      order_id: 'ORD-004',
      product_name: 'Blazer Wanita',
      qty: 8,
      status: 'menunggu',
      department: 'Finishing',
      deadline: '2024-01-21',
      notes: 'Pasang kancing dan lapisan dalam',
      created_at: '2024-01-15 14:30',
      complexity: 'tinggi',
      estimated_time: '2 hari',
      finishing_type: 'Premium',
      accessories: 'Kancing, Lining'
    },
    {
      id: 7,
      order_id: 'ORD-003',
      product_name: 'Celana Jeans Denim',
      qty: 15,
      status: 'menunggu',
      department: 'Packing',
      deadline: '2024-01-26',
      notes: 'Packaging dengan plastik dan kardus',
      created_at: '2024-01-15 15:15',
      complexity: 'rendah',
      estimated_time: '0.5 hari',
      packaging_type: 'Premium Box',
      materials: 'Plastik, Kardus, Sticker'
    },
    {
      id: 8,
      order_id: 'ORD-005',
      product_name: 'Kaos Polo',
      qty: 20,
      status: 'menunggu',
      department: 'Packing',
      deadline: '2024-01-17',
      notes: 'Label dan packaging standar',
      created_at: '2024-01-15 16:00',
      complexity: 'rendah',
      estimated_time: '0.5 hari',
      packaging_type: 'Standar',
      materials: 'Polybag, Label'
    }
  ];

  // Data simulasi pekerjaan yang sudah diambil user
  const initialMyJobs = [];

  // Load user data dan setup departemen
  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    if (userDataFromStorage) {
      const parsedUser = JSON.parse(userDataFromStorage);
      setUser(parsedUser);
      
      // Filter pekerjaan yang tersedia berdasarkan departemen user
      const userDept = parsedUser.department || 'Jahit';
      const filteredJobs = allAvailableJobs.filter(job => 
        job.department === userDept && job.status === 'menunggu'
      );
      
      setAvailableJobs(filteredJobs);
      setMyJobs(initialMyJobs);
      
      // Setup departemen untuk dropdown serah terima
      setupDepartments();
    }
  }, []);

  const setupDepartments = () => {
    // Urutan alur produksi
    const productionFlow = ['Potong', 'Jahit', 'Finishing', 'Packing', 'QC'];
    
    // Ambil semua user yang aktif
    const activeUsers = userData.filter(u => u.status === 'active');
    
    // Kelompokkan berdasarkan departemen
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
    if (!selectedJob) return;

    // Pindahkan job dari available ke myJobs
    const updatedAvailableJobs = availableJobs.filter(j => j.id !== selectedJob.id);
    
    const jobToAccept = {
      ...selectedJob,
      status: 'dalam_proses',
      accepted_at: new Date().toLocaleString('id-ID'),
      progress: 0,
      priority: 'sedang',
      accepted_by: user?.name,
      start_time: new Date().toISOString()
    };

    setMyJobs([...myJobs, jobToAccept]);
    setAvailableJobs(updatedAvailableJobs);
    setSelectedJob(null);
    setShowAcceptModal(false);
    
    alert(`Pekerjaan "${selectedJob.product_name}" berhasil diambil!`);
  };

  const handleHandover = (job) => {
    setSelectedJob(job);
    setShowHandoverModal(true);
  };

  const submitHandover = () => {
    if (!selectedJob || !nextHandler) {
      alert('Pilih penerima terlebih dahulu!');
      return;
    }

    // Cari user penerima
    const receivingUser = userData.find(u => u.id.toString() === nextHandler);
    
    if (!receivingUser) {
      alert('Penerima tidak ditemukan!');
      return;
    }

    // Log handover
    console.log('Handover Log:', {
      job_id: selectedJob.id,
      order_id: selectedJob.order_id,
      from_user: user?.name,
      from_dept: user?.department,
      to_user: receivingUser.name,
      to_dept: receivingUser.department,
      timestamp: new Date().toISOString(),
      notes: `Diserahkan dari ${user?.department} ke ${receivingUser.department}`
    });

    // Hapus job dari daftar myJobs
    const updatedMyJobs = myJobs.filter(job => job.id !== selectedJob.id);
    setMyJobs(updatedMyJobs);
    
    // Reset state
    setSelectedJob(null);
    setNextHandler('');
    setShowHandoverModal(false);
    
    alert(`✅ Pekerjaan berhasil diserahkan ke ${receivingUser.name} (${receivingUser.department})!`);
  };

  const updateProgress = (jobId, progress) => {
    setMyJobs(myJobs.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            progress: Math.min(100, Math.max(0, progress)),
            last_updated: new Date().toLocaleString('id-ID')
          }
        : job
    ));
  };

  const completeJob = (jobId) => {
    const job = myJobs.find(j => j.id === jobId);
    if (!job) return;
    
    if (window.confirm(`Tandai pekerjaan "${job.product_name}" sebagai selesai?`)) {
      setMyJobs(myJobs.map(j => 
        j.id === jobId 
          ? { 
              ...j, 
              status: 'selesai', 
              progress: 100, 
              completed_at: new Date().toLocaleString('id-ID'),
              end_time: new Date().toISOString()
            }
          : j
      ));
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

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Sistem Pekerjaan Departemen</h2>
        <div className="flex items-center bg-gradient-to-r from-blue-50 to-gray-50 p-4 rounded-lg border border-blue-100">
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
              <span className="font-medium ml-3">Role:</span> {user?.role}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Login Sebagai</div>
            <div className="font-semibold text-blue-600">{user?.role === 'Admin' ? 'Administrator' : 'Karyawan Departemen'}</div>
          </div>
        </div>
      </div>

      {/* Toggle Tabs */}
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
        </button>
      </div>

      {/* Pekerjaan Tersedia */}
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
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Urutkan:
              </span>
              <select className="border rounded-lg p-2 text-sm">
                <option>Deadline Terdekat</option>
                <option>Kuantitas Terbanyak</option>
                <option>Kompleksitas</option>
              </select>
            </div>
          </div>
          
          {availableJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableJobs.map(job => (
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
                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {job.created_at}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold border border-blue-200">
                        {job.order_id}
                      </span>
                      <h4 className="font-semibold text-lg text-gray-800">{job.product_name}</h4>
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
                    
                    {job.fabric_type && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Bahan: </span>
                        {job.fabric_type}
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
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
              <div className="text-gray-400 mb-3 text-5xl">🎯</div>
              <p className="text-gray-500 font-medium text-lg">Semua pekerjaan sudah diambil</p>
              <p className="text-gray-400 text-sm mt-2">
                Tidak ada pekerjaan tersedia untuk departemen {user?.department} saat ini
              </p>
              <button 
                onClick={() => setAvailableJobs([...allAvailableJobs.filter(j => j.department === user?.department)])}
                className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ⟳ Refresh daftar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pekerjaan Saya */}
      {!showAvailableJobs && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Pekerjaan yang Sedang Dikerjakan
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Kelola progress dan serah terima pekerjaan Anda
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
            </div>
          </div>
          
          {myJobs.length > 0 ? (
            <div className="space-y-4">
              {myJobs.map(job => (
                <div key={job.id} className="border rounded-xl p-5 hover:bg-gray-50 transition-colors duration-300">
                  <div className="flex justify-between items-start mb-4">
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
                          <h3 className="font-bold text-lg text-gray-800">{job.product_name}</h3>
                        </div>
                        <div className="text-sm text-gray-600">
                          Diambil pada: <span className="font-medium">{job.accepted_at}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Departemen</div>
                      <div className={`px-3 py-1 rounded text-sm font-bold ${getDepartmentColor(job.department)}`}>
                        {job.department}
                      </div>
                    </div>
                  </div>
                  
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
                      <div className="text-gray-500 text-xs mb-1">Waktu Tersisa</div>
                      <div className="font-bold text-gray-800 text-lg">
                        {Math.max(0, Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)))} hari
                      </div>
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
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      Terakhir diperbarui:<br/>
                      <span className="font-medium text-gray-700">{job.last_updated || 'Belum ada update'}</span>
                    </div>
                  </div>
                </div>
              ))}
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
                  <span className="font-bold text-gray-800">{selectedJob.order_id}</span>
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
                  <div className="font-medium">{selectedJob.order_id}</div>
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
        <h4 className="font-bold text-gray-800 mb-4">📊 Ringkasan Pekerjaan</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">{availableJobs.length}</div>
            <div className="text-sm text-gray-600">Tersedia</div>
            <div className="text-xs text-gray-400 mt-1">Menunggu diambil</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{myJobs.length}</div>
            <div className="text-sm text-gray-600">Dalam Proses</div>
            <div className="text-xs text-gray-400 mt-1">Sedang dikerjakan</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {myJobs.filter(j => j.status === 'selesai').length}
            </div>
            <div className="text-sm text-gray-600">Selesai</div>
            <div className="text-xs text-gray-400 mt-1">Telah diselesaikan</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {user?.department ? user.department.toUpperCase() : 'DEPARTEMEN'}
            </div>
            <div className="text-sm text-gray-600">Departemen Anda</div>
            <div className="text-xs text-gray-400 mt-1">Area kerja</div>
          </div>
        </div>
        
        {/* Progress Overall */}
        {myJobs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">Progress Keseluruhan</div>
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
              <div>1. Pilih tab <strong>"Pekerjaan Tersedia"</strong> untuk melihat pekerjaan yang bisa diambil</div>
              <div>2. Klik <strong>"Ambil Pekerjaan"</strong> untuk mulai mengerjakan</div>
              <div>3. Di tab <strong>"Pekerjaan Saya"</strong>, update progress dan tandai selesai</div>
              <div>4. Gunakan <strong>"Serah Terima"</strong> untuk meneruskan ke departemen berikutnya</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}