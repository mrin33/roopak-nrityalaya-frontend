import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PaymentWindowBadge from '../components/PaymentWindowBadge';
import LateFeeWarning from '../components/LateFeeWarning';

const StudentFees = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [currentPayment, setCurrentPayment] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    // TODO: Fetch student fee data from API
    setStudent({
      roll_number: 'PP15',
      full_name: user?.profile?.full_name || 'Student Name',
      level_name: 'Praveshika Pratham',
      monthly_fee: 1000,
      payment_window: 'quarterly',
      discount: 2
    });

    setCurrentPayment({
      payment_id: 1,
      due_date: '2026-02-28',
      base_amount: 3000,
      discount_percentage: 2,
      discount_amount: 60,
      late_fee: 0,
      final_amount: 2940,
      status: 'pending'
    });

    setPaymentHistory([
      { id: 1, payment_date: '2025-11-01', amount: 2940, status: 'paid', payment_method: 'UPI' },
      { id: 2, payment_date: '2025-08-01', amount: 2940, status: 'paid', payment_method: 'Card' },
      { id: 3, payment_date: '2025-05-01', amount: 2940, status: 'paid', payment_method: 'Cash' }
    ]);
  }, [user]);

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // TODO: Process payment via Razorpay
    alert('Payment processed successfully! (Razorpay integration pending)');
    setShowPaymentModal(false);
  };

  if (!student || !currentPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const lateFeeAmount = currentPayment.late_fee || 0;
  const daysUntilDue = Math.ceil((new Date(currentPayment.due_date) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Fee Management
          </h1>
          <p className="text-gray-600">View and manage your fee payments</p>
        </div>

        {/* Late Fee Warning - Using LateFeeWarning Component */}
        <LateFeeWarning 
          hasLateFee={lateFeeAmount > 0}
          lateFeeAmount={lateFeeAmount}
          daysUntilLateFee={daysUntilDue}
          nextDueDate={currentPayment.due_date}
          variant="card"
        />

        {/* Student Info & Current Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Student Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-accent mb-4 pb-2 border-b">Student Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold text-accent">{student.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Roll Number:</span>
                <span className="font-mono font-bold text-primary">{student.roll_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Level:</span>
                <span className="font-semibold">{student.level_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Monthly Fee:</span>
                <span className="font-bold text-primary">₹{student.monthly_fee}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Payment Plan:</span>
                <PaymentWindowBadge 
                  paymentWindow={student.payment_window}
                  discount={student.discount}
                />
              </div>
            </div>
          </div>

          {/* Current Payment Due */}
          <div className="lg:col-span-2 bg-gradient-to-br from-primary to-primary-dark text-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Current Payment Due</h2>
                <p className="text-white/80">
                  Due Date: {new Date(currentPayment.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                currentPayment.status === 'paid' 
                  ? 'bg-green-500' 
                  : 'bg-yellow-500 text-gray-900'
              }`}>
                {currentPayment.status === 'paid' ? 'PAID' : 'PENDING'}
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-lg">
                  <span>Base Amount ({student.payment_window}):</span>
                  <span className="font-semibold">₹{currentPayment.base_amount}</span>
                </div>
                
                {currentPayment.discount_percentage > 0 && (
                  <div className="flex items-center justify-between text-green-300">
                    <span>Discount ({currentPayment.discount_percentage}%):</span>
                    <span className="font-semibold">- ₹{currentPayment.discount_amount}</span>
                  </div>
                )}
                
                {lateFeeAmount > 0 && (
                  <div className="flex items-center justify-between text-red-300">
                    <span>Late Fee:</span>
                    <span className="font-semibold">+ ₹{lateFeeAmount}</span>
                  </div>
                )}
                
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="flex items-center justify-between text-2xl font-bold">
                    <span>Total Amount:</span>
                    <span>₹{currentPayment.final_amount + lateFeeAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {currentPayment.status === 'pending' && (
              <button 
                onClick={handlePayNow}
                className="w-full bg-secondary text-primary py-4 rounded-lg font-bold text-xl hover:bg-secondary-dark transition-colors shadow-lg"
              >
                💳 Pay Now
              </button>
            )}

            {currentPayment.status === 'paid' && (
              <div className="bg-green-500 text-white py-4 rounded-lg text-center font-bold text-xl">
                ✓ Payment Completed
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-2 border-b">Payment History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Payment Method</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-accent">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {new Date(payment.payment_date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">₹{payment.amount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.payment_method}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        ✓ {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-primary-dark font-semibold text-sm">
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paymentHistory.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No payment history available</p>
            </div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
              <div className="bg-primary text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Payment Checkout</h2>
                  <button 
                    onClick={() => setShowPaymentModal(false)}
                    className="text-white hover:bg-white/20 rounded-full p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="p-6">
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Amount to Pay:</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{currentPayment.final_amount + lateFeeAmount}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-accent mb-2">
                      Payment Method
                    </label>
                    <select className="input-field">
                      <option>UPI</option>
                      <option>Credit/Debit Card</option>
                      <option>Net Banking</option>
                      <option>Cash</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You will be redirected to Razorpay payment gateway for secure payment processing.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button 
                    type="button"
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Proceed to Pay
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

export default StudentFees;
