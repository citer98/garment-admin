import React, { useState } from 'react';

export default function JobList() {
  // Simulasi data pekerjaan untuk karyawan yang login
  const [jobs, setJobs] = useState([
    {
      id: 1,
      order_id: 'ORD-001',
      product_name: 'Kemeja Pria Slimfit',
      qty: 10,
      status: 'jahit',
      deadline: '2024-01-20',
      notes: 'Perhatikan kerah dan manset'
    },
    {
      id: 2,
      order_id: 'ORD-002',
      product_name: 'Jaket Hoodie',
      qty: 5,
      status: 'jahit',
      deadline: '2024-01-18',
      notes: 'Tambah kantong depan'
    },
    {
      id: 3,
      order_id: 'ORD-001',
      product_name: 'Celana Jeans Denim',
      qty: 15,
      status: 'jahit',
      deadline: '2024-01-22',
      notes: ''
    }
  ]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [nextHandler, setNextHandler] = useState('');

  // Simulasi daftar karyawan penerima
  const employees = [
    { id: 1, name: 'Siti Aminah', department: 'Finishing' },
    { id: 2, name: 'Desi Ratnasari', department: 'Packing' },
    { id: 3, name: 'Quality Control', department: 'QC' }
  ];

  const handleHandover = (jobId) => {
    const job = jobs.find(j => j.id === jobId);
    setSelectedJob(job);
  };

  const submitHandover = () => {
    if (!selectedJob || !nextHandler) {
      alert('Pilih penerima terlebih dahulu!');
      return;
    }

    // Simulasi proses handover
    console.log('Handover:', {
      from_job: selectedJob,
      to_employee: nextHandler,
      timestamp: new Date().toISOString()
    });

    // Hapus job dari daftar setelah diserahkan
    setJobs(jobs.filter(job => job.id !== selectedJob.id));
    setSelectedJob(null);
    setNextHandler('');
    alert('Barang berhasil diserahkan!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6">Daftar Pekerjaan Saya</h2>
      
      {/* Daftar Job */}
      <div className="space-y-4 mb-8">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                      {job.order_id}
                    </span>
                    <h3 className="font-semibold">{job.product_name}</h3>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Jumlah:</span>
                      <span className="ml-2 font-medium">{job.qty} pcs</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-2 font-medium">{job.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deadline:</span>
                      <span className="ml-2 font-medium">{job.deadline}</span>
                    </div>
                  </div>
                  {job.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Catatan:</span> {job.notes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleHandover(job.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 ml-4"
                >
                  Serah Terima
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <div className="text-gray-400 mb-2">📋</div>
            <p className="text-gray-500">Tidak ada pekerjaan yang ditugaskan</p>
          </div>
        )}
      </div>

      {/* Modal Handover */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Serah Terima Barang</h3>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">{selectedJob.product_name}</p>
              <p className="text-sm text-gray-600">Order: {selectedJob.order_id}</p>
              <p className="text-sm text-gray-600">Qty: {selectedJob.qty} pcs</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serahkan Kepada:
              </label>
              <select
                className="w-full border p-2 rounded-lg"
                value={nextHandler}
                onChange={(e) => setNextHandler(e.target.value)}
              >
                <option value="">-- Pilih Penerima --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setNextHandler('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Batal
              </button>
              <button
                onClick={submitHandover}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
              >
                Konfirmasi Serah Terima
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}