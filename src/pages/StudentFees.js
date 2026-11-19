import React, { useCallback, useEffect, useState } from 'react';
import { PageSkeleton } from '../components/ui/Skeleton';
import PageHeader from '../components/ui/PageHeader';
import Icon from '../components/ui/Icon';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import LateFeeWarning from '../components/LateFeeWarning';
import StatusBadge from '../components/StatusBadge';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import studentService from '../services/studentService';
import { useToast } from '../context/ToastContext';
import { formatDate, toDate } from '../utils/date';

const PLANS = [
  ['monthly', 'Monthly'],
  ['quarterly', 'Quarterly'],
  ['half_yearly', 'Half-yearly'],
  ['yearly', 'Yearly'],
];
const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const fmtDate = (d) => (d ? formatDate(d, { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
const method = (m) => (m ? m.replace('_', ' ') : '—');

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

  if (loading) return <PageSkeleton label="Loading fee details…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const { student, currentPayment } = info;
  const fs = student.fee_structure;
  const due = currentPayment && currentPayment.status !== 'paid' ? currentPayment : null;
  const daysUntilDue = due ? Math.ceil((toDate(due.due_date) - new Date().setHours(0, 0, 0, 0)) / 86400000) : 0;

  return (
    <div className="page">
      <PageHeader title="Fees" description="Your fee plan, current dues and payment history." />

      {due && (
        <div className="mb-6">
          <LateFeeWarning hasLateFee={due.late_fee > 0} lateFeeAmount={due.late_fee} daysUntilLateFee={Math.max(daysUntilDue, 0)} nextDueDate={due.due_date} />
        </div>
      )}

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        {/* Current dues */}
        <section className="relative overflow-hidden rounded-xl bg-accent p-6 text-sand-100 sm:p-8 lg:col-span-2" aria-labelledby="dues-heading">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border-[22px] border-secondary-500/15" aria-hidden="true" />
          <h2 id="dues-heading" className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-secondary-300">
            Current dues
          </h2>
          {!currentPayment ? (
            <p className="mt-4 text-sand-300">No fee records yet. Your first fee will appear here once the office records it.</p>
          ) : due ? (
            <>
              <p className="mt-3 font-heading text-4xl font-semibold tabular-nums text-sand-50">{inr(due.final_amount)}</p>
              <p className="mt-1 text-sm text-sand-300">Due {fmtDate(due.due_date)}</p>
              <dl className="mt-6 max-w-sm space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-sand-300">Fee</dt>
                  <dd className="tabular-nums">{inr(due.base_amount)}</dd>
                </div>
                {due.late_fee > 0 && (
                  <div className="flex justify-between text-amber-200">
                    <dt>Late fee</dt>
                    <dd className="tabular-nums">+ {inr(due.late_fee)}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-6 flex gap-3 rounded-lg bg-white/5 p-4 text-sm text-sand-200">
                <Icon name="info" className="mt-0.5 h-5 w-5 shrink-0 text-secondary-300" />
                <span>
                  Online payment is not available yet. Please pay at the academy office (cash, UPI, card, net banking or
                  cheque); your payment will appear here once it is recorded.
                </span>
              </p>
            </>
          ) : (
            <div className="mt-4 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-300">
                <Icon name="checkCircle" className="h-7 w-7" />
              </span>
              <div>
                <p className="font-heading text-2xl font-semibold text-sand-50">All paid</p>
                <p className="mt-1 text-sm text-sand-300">
                  Last payment of {inr(currentPayment.final_amount)} on {fmtDate(currentPayment.payment_date)}
                  {currentPayment.payment_method ? ` via ${method(currentPayment.payment_method)}` : ''}.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Plan */}
        <section className="card" aria-labelledby="plan-heading">
          <h2 id="plan-heading" className="section-title mb-4">
            My fee plan
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">Roll number</dt>
              <dd className="font-mono font-medium">{student.roll_number || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-600">Level</dt>
              <dd className="text-right font-medium">{student.level_name || '—'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-gray-600">Plan</dt>
              <dd>
                <PaymentWindowBadge paymentWindow={student.payment_window} discount={fs?.discount_percentage || 0} />
              </dd>
            </div>
            {fs ? (
              <>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Fee per period</dt>
                  <dd className="font-medium tabular-nums">{inr(fs.discounted_amount)}</dd>
                </div>
                {fs.discount_percentage > 0 && (
                  <div className="flex justify-between gap-4 text-green-700">
                    <dt>You save</dt>
                    <dd className="font-medium tabular-nums">{inr(fs.base_amount - fs.discounted_amount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Late fee</dt>
                  <dd className="text-right">
                    {inr(fs.late_fee_amount)} after {fs.grace_period_days} days
                  </dd>
                </div>
              </>
            ) : (
              <p className="callout-info">The fee for this plan has not been set for your level yet. Please ask the office.</p>
            )}
          </dl>
          <form onSubmit={changePlan} className="mt-5 border-t border-sand-200 pt-4">
            <label htmlFor="plan" className="form-label">
              Change payment plan
            </label>
            <div className="flex gap-2">
              <select id="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className="input-field">
                {PLANS.map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <button type="submit" disabled={savingPlan || plan === student.payment_window} className="btn-primary">
                {savingPlan ? 'Saving…' : 'Save'}
              </button>
            </div>
            <p className="form-hint">A new plan applies from your next fee.</p>
          </form>
        </section>
      </div>

      {/* History */}
      <section className="surface overflow-hidden" aria-labelledby="history-heading">
        <h2 id="history-heading" className="section-title border-b border-sand-200 px-4 py-4 sm:px-6">
          Payment history
        </h2>
        {records.length === 0 ? (
          <EmptyState icon="cash" title="No payments yet" description="Payments recorded by the academy office will be listed here." size="sm" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th scope="col">Period</th>
                  <th scope="col" className="text-right">
                    Amount
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col" className="hidden sm:table-cell">
                    Paid on
                  </th>
                  <th scope="col" className="hidden sm:table-cell">
                    Due
                  </th>
                  <th scope="col" className="hidden md:table-cell">
                    Method
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r.payment_id}>
                    <td className="whitespace-nowrap font-medium text-accent">
                      {r.payment_month && r.payment_year
                        ? new Date(r.payment_year, r.payment_month - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })
                        : '—'}
                    </td>
                    <td className="text-right font-medium tabular-nums">{inr(r.total_amount)}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="hidden whitespace-nowrap text-gray-600 sm:table-cell">{r.raw_status === 'completed' ? fmtDate(r.payment_date) : '—'}</td>
                    <td className="hidden whitespace-nowrap text-gray-600 sm:table-cell">{fmtDate(r.due_date)}</td>
                    <td className="hidden capitalize text-gray-600 md:table-cell">{method(r.payment_method)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentFees;
