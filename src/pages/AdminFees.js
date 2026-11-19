import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminFees = () => {
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    month: '',
    amount: '',
    paymentMethod: '',
    transactionId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const adminService = require('../services/adminService').default;
      const [feesData, studentsData] = await Promise.all([
        adminService.getAllFees(),
        adminService.getAllStudents()
      ]);
      setPayments(feesData.map(f => ({
        id: f.payment_id,
        studentName: f.full_name || 'Unknown',
        rollNo: f.roll_number || 'N/A',
        month: f.payment_date ? new Date(f.payment_date).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'N/A',
        amount: Number(f.amount_paid) || 0,
        status: f.status || 'paid',
        paidDate: f.payment_date ? f.payment_date.split('T')[0] : null,
        paymentId: f.transaction_reference || `PAY-${f.payment_id}`
      })));
      setStudents(studentsData || []);
    } catch (err) {
      console.error('Error fetching fees data:', err);
      setError('Failed to load fees data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = (payment.studentName && payment.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (payment.rollNo && payment.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const adminService = require('../services/adminService').default;
      await adminService.recordFeePayment({
        student_id: formData.studentId,
        amount_paid: formData.amount,
        payment_method: formData.paymentMethod,
        transaction_reference: formData.transactionId || null,
        status: 'completed',
        notes: `Fee for ${formData.month}`
      });
      alert('Payment recorded successfully!');
      fetchData();
      setShowRecordModal(false);
      setFormData({ studentId: '', month: '', amount: '', paymentMethod: '', transactionId: '' });
    } catch (err) {
      console.error('Error recording payment:', err);
      alert('Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalCollected: payments.filter(p => p.status === 'paid' || p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdue: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    collectionRate: payments.length > 0 ? Math.round((payments.filter(p => p.status === 'paid' || p.status === 'completed').length / payments.length) * 100) : 0
  };

  if (loading && payments.length === 0) return <LoadingSpinner fullScreen={true} text="Loading fees data..." size="lg" />;
  if (error) return <div className="min-h-screen flex items-center justify-center"><div className="text-red-600">{error}</div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">Fee Management</h1>
            <p className="text-gray-600">Track and manage student fee payments</p>
          </div>
          <button onClick={() => setShowRecordModal(true)} className="btn-primary">
            + Record Payment
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-green-600">₹{stats.totalCollected.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">₹{stats.pending.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">₹{stats.overdue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Collection Rate</p>
            <p className="text-3xl font-bold text-blue-600">{stats.collectionRate}%</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-2">Showing {filteredPayments.length} of {payments.length} records</p>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Roll No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Month</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{payment.rollNo}</td>
                  <td className="px-6 py-4 font-semibold text-accent">{payment.studentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{payment.month}</td>
                  <td className="px-6 py-4 text-sm font-semibold">₹{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {payment.paidDate || payment.dueDate || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{payment.paymentId || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Record Payment Modal */}
        {showRecordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="bg-primary text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Record Payment</h2>
                  <button onClick={() => setShowRecordModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Student *</label>
                    <select name="studentId" value={formData.studentId} onChange={handleChange} className="input-field" required>
                      <option value="">Select student</option>
                      {students.map(s => (
                        <option key={s.student_id} value={s.student_id}>
                          {s.roll_number} - {s.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">Month *</label>
                      <input type="month" name="month" value={formData.month} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-accent mb-2">Amount *</label>
                      <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field" min="0" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Payment Method *</label>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field" required>
                      <option value="">Select method</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">Transaction ID</label>
                    <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="input-field" placeholder="Optional" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowRecordModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary">Record Payment</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFees;
