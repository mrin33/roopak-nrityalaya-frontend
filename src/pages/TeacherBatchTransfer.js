import React, { useState, useEffect } from 'react';

const TeacherBatchTransfer = () => {
  // unused useAuth
  const [myBatches, setMyBatches] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [formData, setFormData] = useState({
    substituteTeacherId: '',
    transferDate: '',
    reason: ''
  });

  useEffect(() => {
    // TODO: Fetch from API
    setMyBatches([
      {
        id: 1,
        batch_name: 'Morning Batch A',
        level_name: 'Praveshika Pratham',
        schedule: 'Mon, Wed, Fri',
        time: '8:00 AM - 9:30 AM',
        student_count: 12
      },
      {
        id: 2,
        batch_name: 'Evening Batch B',
        level_name: 'Madhyama Pratham',
        schedule: 'Tue, Thu, Sat',
        time: '5:00 PM - 6:30 PM',
        student_count: 15
      }
    ]);

    setTeachers([
      { id: 2, full_name: 'Rajesh Kumar', specialization: 'Madhyama & Visharad Levels' },
      { id: 3, full_name: 'Meera Iyer', specialization: 'Advanced Levels' },
      { id: 4, full_name: 'Anita Desai', specialization: 'All Levels' }
    ]);

    setTransfers([
      {
        id: 1,
        batch_name: 'Morning Batch A',
        substitute_teacher_name: 'Rajesh Kumar',
        transfer_date: '2026-02-10',
        reason: 'Personal work',
        status: 'active',
        created_at: '2026-02-05T09:00:00'
      },
      {
        id: 2,
        batch_name: 'Evening Batch B',
        substitute_teacher_name: 'Meera Iyer',
        transfer_date: '2026-01-28',
        reason: 'Medical appointment',
        status: 'completed',
        created_at: '2026-01-25T14:00:00'
      }
    ]);
  }, []);

  const handleTransferBatch = (batch) => {
    setSelectedBatch(batch);
    setFormData({
      substituteTeacherId: '',
      transferDate: '',
      reason: ''
    });
    setShowTransferModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call
    const selectedTeacher = teachers.find(t => t.id === parseInt(formData.substituteTeacherId));
    const newTransfer = {
      id: transfers.length + 1,
      batch_name: selectedBatch.batch_name,
      substitute_teacher_name: selectedTeacher.full_name,
      transfer_date: formData.transferDate,
      reason: formData.reason,
      status: new Date(formData.transferDate) > new Date() ? 'active' : 'completed',
      created_at: new Date().toISOString()
    };
    setTransfers([newTransfer, ...transfers]);
    setShowTransferModal(false);
    alert(`Batch transferred to ${selectedTeacher.full_name} for ${formData.transferDate}!`);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">✓ Active</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Cancelled</span>;
      default:
        return null;
    }
  };

  const activeTransfers = transfers.filter(t => t.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Batch Transfers
          </h1>
          <p className="text-gray-600">Transfer your batch to another teacher for a day</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Batch transfers are for one day only. Students will be notified about the substitute teacher.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">My Batches</p>
            <p className="text-3xl font-bold text-primary">{myBatches.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Active Transfers</p>
            <p className="text-3xl font-bold text-green-600">{activeTransfers.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Transfers</p>
            <p className="text-3xl font-bold text-blue-600">{transfers.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">My Batches</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myBatches.map((batch) => (
              <div key={batch.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-accent mb-1">{batch.batch_name}</h3>
                    <p className="text-sm text-gray-600">{batch.level_name}</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    {batch.student_count} students
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {batch.schedule}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {batch.time}
                  </div>
                </div>

                <button
                  onClick={() => handleTransferBatch(batch)}
                  className="w-full btn-primary"
                >
                  Transfer Batch
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">Transfer History</h2>
          
          {transfers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No batch transfers yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transfers.map((transfer) => (
                <div key={transfer.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-accent">{transfer.batch_name}</h3>
                        {getStatusBadge(transfer.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Substitute: <span className="font-semibold">{transfer.substitute_teacher_name}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        {new Date(transfer.transfer_date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Reason:</strong> {transfer.reason}
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Requested: {new Date(transfer.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {showTransferModal && selectedBatch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="bg-primary text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Transfer Batch</h2>
                    <p className="text-sm text-white/80 mt-1">{selectedBatch.batch_name}</p>
                  </div>
                  <button 
                    onClick={() => setShowTransferModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Select Substitute Teacher *
                    </label>
                    <select
                      name="substituteTeacherId"
                      value={formData.substituteTeacherId}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Choose a teacher...</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.full_name} - {teacher.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Transfer Date *
                    </label>
                    <input
                      type="date"
                      name="transferDate"
                      value={formData.transferDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Select a date when you need a substitute teacher
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Reason for Transfer *
                    </label>
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      rows="4"
                      className="input-field"
                      placeholder="E.g., Personal work, Medical appointment, Workshop attendance..."
                      required
                    ></textarea>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Students will be automatically notified about the substitute teacher via email/SMS.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setShowTransferModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Confirm Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherBatchTransfer;
