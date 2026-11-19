import React, { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';

const formatMonth = (f) =>
  f.payment_month && f.payment_year
    ? new Date(f.payment_year, f.payment_month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' })
    : 'N/A';

const STATUS_STYLE = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  overdue: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-700',
};

const EMPTY_FORM = { studentId: '', month: '', amount: '', paymentMethod: '', transactionId: '', dueDate: '' };
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const AdminFees = () => {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [feesData, studentsData] = await Promise.all([adminService.getAllFees(), adminService.getAllStudents()]);
      setPayments(
        feesData.map((f) => ({
          id: f.payment_id,
          studentName: f.student_name || 'Unknown',
          rollNo: f.roll_number || 'N/A',
          month: formatMonth(f),
          amount: Number(f.total_amount) || 0,
          status: f.payment_status, // paid | pending | overdue | failed | refunded
          paidDate: f.status === 'completed' && f.payment_date ? f.payment_date.slice(0, 10) : null,
          dueDate: f.due_date ? f.due_date.slice(0, 10) : null,
          method: f.payment_method,
          paymentId: f.transaction_id || `PAY-${f.payment_id}`,
        }))
      );
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || 'Failed to load fees data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const q = searchTerm.toLowerCase();
  const filteredPayments = payments.filter(
    (p) =>
      (p.studentName.toLowerCase().includes(q) || p.rollNo.toLowerCase().includes(q)) &&
      (filterStatus === 'all' || p.status === filterStatus)
  );

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.recordFeePayment({
        student_id: formData.studentId,
        amount_paid: formData.amount,
        payment_method: formData.paymentMethod,
        transaction_id: formData.transactionId || undefined,
        month: formData.month,
        due_date: formData.dueDate || undefined,
        status: 'completed',
        notes: `Fee for ${formData.month}`,
      });
      toast.success('Payment recorded.');
      setShowRecordModal(false);
      setFormData(EMPTY_FORM);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  const sum = (status) => payments.filter((p) => p.status === status).reduce((s, p) => s + p.amount, 0);
  const stats = {
    totalCollected: sum('paid'),
    pending: sum('pending'),
    overdue: sum('overdue'),
    collectionRate: payments.length ? Math.round((payments.filter((p) => p.status === 'paid').length / payments.length) * 100) : 0,
  };

  if (loading && !payments.length) return <LoadingSpinner fullScreen={true} text="Loading fees data..." size="lg" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary mb-2">Fee Management</h1>
            <p className="text-gray-600">Track and manage student fee payments</p>
          </div>
          <button onClick={() => setShowRecordModal(true)} className="btn-primary">
            + Record Payment
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            ['Total Collected', inr(stats.totalCollected), 'text-green-600'],
            ['Pending', inr(stats.pending), 'text-yellow-600'],
            ['Overdue', inr(stats.overdue), 'text-red-600'],
            ['Collection Rate', `${stats.collectionRate}%`, 'text-blue-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <p className="text-sm text-gray-600 mb-1">{label}</p>
              <p className={`text-2xl sm:text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="search"
              placeholder="Search by student name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              aria-label="Search payments"
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-field" aria-label="Filter by status">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredPayments.length} of {payments.length} records
          </p>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg">
            <EmptyState
              icon="document"
              title={payments.length ? 'No payments match your filters' : 'No fee records yet'}
              description={payments.length ? 'Try a different search or status.' : 'Record a payment to start tracking fees.'}
              actionText={payments.length ? undefined : 'Record Payment'}
              onAction={payments.length ? undefined : () => setShowRecordModal(true)}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2">
                  <tr>
                    {['Roll No', 'Student Name', 'Month', 'Amount', 'Status', 'Paid / Due', 'Method', 'Payment ID'].map((h) => (
                      <th key={h} className="px-6 py-4 text-left text-sm font-semibold text-accent whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{p.rollNo}</td>
                      <td className="px-6 py-4 font-semibold text-accent">{p.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{p.month}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{inr(p.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[p.status] || STATUS_STYLE.refunded}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {p.paidDate ? `Paid ${p.paidDate}` : p.dueDate ? `Due ${p.dueDate}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">{(p.method || '-').replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{p.paymentId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showRecordModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-primary text-white p-6 rounded-t-2xl flex items-center justify-between">
                <h2 className="text-2xl font-bold">Record Payment</h2>
                <button onClick={() => setShowRecordModal(false)} className="text-white hover:bg-white/20 rounded-full p-2" aria-label="Close">
                  ×
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="f-student" className="block text-sm font-semibold text-accent mb-2">Student *</label>
                    <select id="f-student" name="studentId" value={formData.studentId} onChange={handleChange} className="input-field" required>
                      <option value="">Select student</option>
                      {students.map((s) => (
                        <option key={s.student_id} value={s.student_id}>
                          {s.roll_number} - {s.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="f-month" className="block text-sm font-semibold text-accent mb-2">Fee Month *</label>
                      <input id="f-month" type="month" name="month" value={formData.month} onChange={handleChange} className="input-field" required />
                    </div>
                    <div>
                      <label htmlFor="f-amount" className="block text-sm font-semibold text-accent mb-2">Amount (₹) *</label>
                      <input id="f-amount" type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field" min="1" step="0.01" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="f-method" className="block text-sm font-semibold text-accent mb-2">Payment Method *</label>
                      <select id="f-method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field" required>
                        <option value="">Select method</option>
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="upi">UPI</option>
                        <option value="net_banking">Net Banking / Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="f-due" className="block text-sm font-semibold text-accent mb-2">Due Date</label>
                      <input id="f-due" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input-field" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="f-tx" className="block text-sm font-semibold text-accent mb-2">Transaction ID</label>
                    <input id="f-tx" type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} className="input-field" placeholder="Optional" />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                  <button type="button" onClick={() => setShowRecordModal(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                    {saving ? 'Saving…' : 'Record Payment'}
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

export default AdminFees;
