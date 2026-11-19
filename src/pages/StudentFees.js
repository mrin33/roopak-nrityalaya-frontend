import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import LateFeeWarning from '../components/LateFeeWarning';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';

const PLANS = [
  ['monthly', 'Monthly'],
  ['quarterly', 'Quarterly'],
  ['half_yearly', 'Half-Yearly'],
  ['yearly', 'Yearly'],
];
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—');
const STATUS_STYLE = {
  paid: 'bg-green-100 text-green-800',
  pending: 'bg-amber-100 text-amber-800',
  overdue: 'bg-red-100 text-red-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-sand-100 text-gray-700',
};

const StudentFees = () => {
  const toast = useToast();
  const [info, setInfo] = useState(null); // { student, currentPayment }
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState('');
  const [savingPlan, setSavingPlan] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [current, all] = await Promise.all([studentService.getCurrentPayment(), studentService.getFees()]);
      setInfo(current);
      setPlan(current.student.payment_window);
      setRecords(all);
    } catch (err) {
      setError(err.message || 'Could not load your fee details');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const changePlan = async (e) => {
    e.preventDefault();
    setSavingPlan(true);
    try {
      await studentService.updatePaymentWindow(plan);
      toast.success('Payment plan updated. It applies from your next fee.');
      load();
    } catch (err) {
      toast.error(err.message || 'Could not change the payment plan.');
    } finally {
      setSavingPlan(false);
    }
  };

  if (loading) return <PageSkeleton label="Loading fee details..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { student, currentPayment } = info;
  const fs = student.fee_structure;
  const due = currentPayment && currentPayment.status !== 'paid' ? currentPayment : null;
  const daysUntilDue = due ? Math.ceil((new Date(due.due_date) - new Date()) / 86400000) : 0;

  return (
    <div className="page">
      <div>
        <div className="mb-8">
          <h1 className="page-title">Fee Management</h1>
          <p className="text-gray-600">Your fee plan, dues and payment history</p>
        </div>

        {due && (
          <div className="mb-6">
            <LateFeeWarning
              hasLateFee={due.late_fee > 0}
              lateFeeAmount={due.late_fee}
              daysUntilLateFee={Math.max(daysUntilDue, 0)}
              nextDueDate={due.due_date}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Student & plan */}
          <div className="card">
            <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">My Fee Plan</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-gray-600">Roll Number</dt><dd className="font-semibold">{student.roll_number || '—'}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-gray-600">Level</dt><dd className="font-semibold text-right">{student.level_name || '—'}</dd></div>
              <div className="flex justify-between gap-4 items-center"><dt className="text-gray-600">Plan</dt><dd><PaymentWindowBadge paymentWindow={student.payment_window} discount={fs?.discount_percentage || 0} /></dd></div>
              {fs ? (
                <>
                  <div className="flex justify-between gap-4"><dt className="text-gray-600">Fee per period</dt><dd className="font-semibold">{inr(fs.discounted_amount)}</dd></div>
                  {fs.discount_percentage > 0 && (
                    <div className="flex justify-between gap-4 text-green-700"><dt>You save</dt><dd className="font-semibold">{inr(fs.base_amount - fs.discounted_amount)}</dd></div>
                  )}
                  <div className="flex justify-between gap-4"><dt className="text-gray-600">Late fee</dt><dd>{inr(fs.late_fee_amount)} after {fs.grace_period_days} days</dd></div>
                </>
              ) : (
                <p className="text-gray-500">The fee for this plan has not been set for your level yet. Please ask the office.</p>
              )}
            </dl>
            <form onSubmit={changePlan} className="mt-6 pt-4 border-t">
              <label htmlFor="plan" className="form-label">Change payment plan</label>
              <div className="flex gap-2">
                <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className="input-field">
                  {PLANS.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
                <button type="submit" disabled={savingPlan || plan === student.payment_window} className="btn-primary px-4 disabled:opacity-50">
                  {savingPlan ? '…' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          {/* Current dues */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-4">Current Dues</h2>
            {!currentPayment ? (
              <p className="text-white/80">No fee records yet. Your first fee will appear here once the office records it.</p>
            ) : due ? (
              <>
                <p className="text-white/80 mb-6">Due on {fmtDate(due.due_date)}</p>
                <div className="space-y-2 mb-6 text-lg">
                  <div className="flex justify-between"><span>Fee</span><span className="font-semibold">{inr(due.base_amount)}</span></div>
                  {due.late_fee > 0 && <div className="flex justify-between text-amber-200"><span>Late fee</span><span className="font-semibold">+ {inr(due.late_fee)}</span></div>}
                  <div className="flex justify-between text-2xl font-bold pt-2 border-t border-white/30"><span>Total</span><span>{inr(due.final_amount)}</span></div>
                </div>
                <p className="bg-white/10 rounded-lg p-4 text-sm">
                  Online payment is not available yet. Please pay at the academy office (cash, UPI, card, net banking or cheque);
                  your payment will appear here once it is recorded.
                </p>
              </>
            ) : (
              <div>
                <p className="text-3xl font-bold mb-2">All paid ✓</p>
                <p className="text-white/80">
                  Last payment of {inr(currentPayment.final_amount)} on {fmtDate(currentPayment.payment_date)}
                  {currentPayment.payment_method ? ` via ${currentPayment.payment_method.replace('_', ' ')}` : ''}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        <div className="card">
          <h2 className="section-title mb-5 border-b border-sand-200 pb-3">Payment History</h2>
          {records.length === 0 ? (
            <EmptyState icon="document" title="No payments yet" description="Payments recorded by the academy office will be listed here." size="sm" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['Period', 'Amount', 'Status', 'Paid on', 'Due', 'Method'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 font-semibold text-accent whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.payment_id} className="border-b hover:bg-sand-50">
                      <td className="py-3 px-4 whitespace-nowrap">
                        {r.payment_month && r.payment_year
                          ? new Date(r.payment_year, r.payment_month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
                          : '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold">{inr(r.total_amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[r.status] || 'bg-sand-100'}`}>{r.status}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{r.raw_status === 'completed' ? fmtDate(r.payment_date) : '—'}</td>
                      <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{fmtDate(r.due_date)}</td>
                      <td className="py-3 px-4 text-gray-600 capitalize">{(r.payment_method || '—').replace('_', ' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
