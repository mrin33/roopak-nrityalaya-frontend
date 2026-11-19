import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Modal from '../components/ui/Modal';
import Icon from '../components/ui/Icon';
import StatusBadge from '../components/StatusBadge';
import RollNumberBadge from '../components/RollNumberBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import adminService from '../services/adminService';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/date';

const formatMonth = (f) =>
  f.payment_month && f.payment_year ? new Date(f.payment_year, f.payment_month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }) : '—';
const shortDate = (d) => formatDate(d, { day: 'numeric', month: 'short', year: 'numeric' });
const EMPTY_FORM = { studentId: '', month: '', amount: '', paymentMethod: '', transactionId: '', dueDate: '' };
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const STATUS_TABS = [
  ['all', 'All'],
  ['paid', 'Paid'],
  ['pending', 'Pending'],
  ['overdue', 'Overdue'],
  ['refunded', 'Refunded'],
];

const AdminFees = () => {
  const toast = useToast();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
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
          rollNo: f.roll_number || '',
          month: formatMonth(f),
          amount: Number(f.total_amount) || 0,
          status: f.payment_status, // paid | pending | overdue | failed | refunded
          paidDate: f.status === 'completed' && f.payment_date ? f.payment_date : null,
          dueDate: f.due_date || null,
          method: f.payment_method,
          reference: f.transaction_id || `PAY-${f.payment_id}`,
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

  const q = searchTerm.trim().toLowerCase();
  const filtered = payments.filter(
    (p) => (!q || p.studentName.toLowerCase().includes(q) || p.rollNo.toLowerCase().includes(q)) && (filterStatus === 'all' || p.status === filterStatus)
  );

  const handleChange = (e) => setFormData((f) => ({ ...f, [e.target.name]: e.target.value }));
  const openModal = () => {
    setFormData(EMPTY_FORM);
    setShowModal(true);
  };

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
      toast.success('Payment recorded. The student can see it in their portal.');
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  const sum = (status) => payments.filter((p) => p.status === status).reduce((s, p) => s + p.amount, 0);
  const count = (s) => (s === 'all' ? payments.length : payments.filter((p) => p.status === s).length);
  const collectionRate = payments.length ? Math.round((count('paid') / payments.length) * 100) : 0;

  if (loading && !payments.length) return <PageSkeleton label="Loading fees…" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="page">
      <PageHeader
        title="Fees"
        description="Payments recorded at the academy office, and dues outstanding."
        actions={
          <button type="button" onClick={openModal} className="btn-primary">
            <Icon name="plus" className="h-4 w-4" /> Record payment
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Collected" value={inr(sum('paid'))} icon="checkCircle" tone="success" />
        <StatCard label="Pending" value={inr(sum('pending'))} icon="clock" tone="warning" />
        <StatCard label="Overdue" value={inr(sum('overdue'))} icon="warning" tone="danger" />
        <StatCard label="Collection rate" value={payments.length ? `${collectionRate}%` : '—'} hint="Paid records / all records" icon="chart" tone="brand" />
      </div>

      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-sand-200 p-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" placeholder="Student name or roll number" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-9" aria-label="Search payments" />
          </div>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by status">
            {STATUS_TABS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => setFilterStatus(v)} aria-pressed={filterStatus === v} className={filterStatus === v ? 'tab-active' : 'tab'}>
                {l} <span className="ml-1 text-xs opacity-70">{count(v)}</span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="cash"
            title={payments.length ? 'No payments match your filters' : 'No fee records yet'}
            description={payments.length ? 'Try a different search or status.' : 'Record a payment to start tracking fees.'}
            actionText={payments.length ? undefined : 'Record payment'}
            onAction={payments.length ? undefined : openModal}
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Student</th>
                  <th scope="col">Period</th>
                  <th scope="col" className="text-right">
                    Amount
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" className="hidden md:table-cell">
                    Paid / due
                  </th>
                  <th scope="col" className="hidden lg:table-cell">
                    Method
                  </th>
                  <th scope="col" className="hidden xl:table-cell">
                    Reference
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="font-medium text-accent">{p.studentName}</p>
                      <RollNumberBadge rollNumber={p.rollNo} size="sm" />
                    </td>
                    <td className="whitespace-nowrap text-gray-600">{p.month}</td>
                    <td className="text-right font-medium tabular-nums">{inr(p.amount)}</td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="hidden whitespace-nowrap text-gray-600 md:table-cell">
                      {p.paidDate ? `Paid ${shortDate(p.paidDate)}` : p.dueDate ? `Due ${shortDate(p.dueDate)}` : '—'}
                    </td>
                    <td className="hidden capitalize text-gray-600 lg:table-cell">{(p.method || '—').replace('_', ' ')}</td>
                    <td className="hidden font-mono text-xs text-gray-500 xl:table-cell">{p.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="border-t border-sand-200 px-5 py-3 text-xs text-gray-500">
          Showing {filtered.length} of {payments.length} records
        </p>
      </section>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Record a payment" description="Use this for payments received at the office." size="md" dismissible={!saving}>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="f-student" className="form-label">
                Student
              </label>
              <select id="f-student" name="studentId" value={formData.studentId} onChange={handleChange} className="input-field" required>
                <option value="">Select student</option>
                {students.map((s) => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.roll_number} — {s.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="f-month" className="form-label">
                  Fee month
                </label>
                <input id="f-month" type="month" name="month" value={formData.month} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label htmlFor="f-amount" className="form-label">
                  Amount (₹)
                </label>
                <input id="f-amount" type="number" inputMode="decimal" name="amount" value={formData.amount} onChange={handleChange} className="input-field" min="1" step="0.01" required />
              </div>
              <div>
                <label htmlFor="f-method" className="form-label">
                  Method
                </label>
                <select id="f-method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="input-field" required>
                  <option value="">Select method</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="net_banking">Net banking / bank transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div>
                <label htmlFor="f-due" className="form-label">
                  Due date <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <input id="f-due" type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="input-field" />
              </div>
            </div>
            <div>
              <label htmlFor="f-tx" className="form-label">
                Transaction / receipt reference <span className="font-normal text-gray-500">(optional)</span>
              </label>
              <input id="f-tx" name="transactionId" value={formData.transactionId} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving…' : 'Record payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminFees;
