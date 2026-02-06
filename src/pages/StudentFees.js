import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentFees = () => {
  const { user } = useAuth();
  const [feeData, setFeeData] = useState({
    monthlyFee: 1000,
    // NEW Phase 1 fields
    payment_window: 'quarterly',
    discount: 2,
    monthly_savings: 60,
    currentMonth: {
      month: 'February 2026',
      base_amount: 3000,
      discount: 2,
      discount_amount: 60,
      final_amount: 2940,
      late_fee: 0,
      is_late: false,
      status: 'pending',
      dueDate: '2026-02-05',
      days_until_late_fee: 8
    },
    history: []
  });

  useEffect(() => {
    // TODO: Fetch real fee data from API
    setFeeData({
      monthlyFee: 1000,
      // NEW Phase 1 fields
      payment_window: 'quarterly',
      discount: 2,
      monthly_savings: 20,
      currentMonth: {
        month: 'February 2026',
        base_amount: 3000,
        discount: 2,
        discount_amount: 60,
        final_amount: 2940,
        late_fee: 0,
        is_late: false,
        status: 'pending',
        dueDate: '2026-02-05',
        days_until_late_fee: 8
      },
      history: [
        { month: 'January 2026', base_amount: 3000, discount: 2, amount: 2940, late_fee: 0, total: 2940, status: 'paid', paidDate: '2026-01-03', paymentId: 'PAY001' },
        { month: 'October 2025', base_amount: 3000, discount: 2, amount: 2940, late_fee: 0, total: 2940, status: 'paid', paidDate: '2025-10-02', paymentId: 'PAY002' },
        { month: 'July 2025', base_amount: 3000, discount: 2, amount: 2940, late_fee: 100, total: 3040, status: 'paid', paidDate: '2025-07-20', paymentId: 'PAY003' },
      ]
    });
  }, []);

  const handlePayNow = () => {
    // TODO: Integrate Razorpay payment gateway
    alert('Razorpay integration will be added here!\nFor now, this is just a placeholder.');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Paid</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>;
      case 'overdue':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Fee Management
          </h1>
          <p className="text-gray-600">View and manage your monthly fee payments</p>
        </div>

        {/* Payment Plan Section - NEW Phase 1 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-accent mb-6">Your Payment Plan</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Current Plan</p>
              <p className="text-lg font-bold text-primary capitalize">
                {feeData.payment_window}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Discount</p>
              <p className="text-lg font-bold text-green-600">
                {feeData.discount}%
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">You Save</p>
              <p className="text-lg font-bold text-blue-600">
                ₹{feeData.monthly_savings}/month
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <button className="w-full btn-secondary text-sm">
                Change Plan
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-gray-700">
              💡 <strong>Tip:</strong> Save more by paying in advance! 
              Yearly plan gives you 10% discount (₹1,200 savings per year).
            </p>
          </div>
        </div>

        {/* Current Month Fee Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Current Payment</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Month:</span>
                  <span className="font-semibold">{feeData.currentMonth.month}</span>
                </div>
                
                {/* Fee Breakdown - NEW Phase 1 */}
                <div className="space-y-2 py-3 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Base Amount:</span>
                    <span>₹{feeData.currentMonth.base_amount}</span>
                  </div>
                  
                  {feeData.currentMonth.discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-green-300">
                      <span>Discount ({feeData.currentMonth.discount}%):</span>
                      <span>- ₹{feeData.currentMonth.discount_amount}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between font-bold text-lg pt-2 border-t border-white/20">
                    <span>Amount to Pay:</span>
                    <span className="text-2xl">₹{feeData.currentMonth.final_amount}</span>
                  </div>
                  
                  {feeData.currentMonth.is_late && feeData.currentMonth.late_fee > 0 && (
                    <>
                      <div className="flex items-center justify-between text-red-300 pt-2 border-t border-red-300/30">
                        <span>Late Fee:</span>
                        <span>+ ₹{feeData.currentMonth.late_fee}</span>
                      </div>
                      <div className="flex items-center justify-between font-bold text-xl text-red-200">
                        <span>Total Due:</span>
                        <span>₹{feeData.currentMonth.final_amount + feeData.currentMonth.late_fee}</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white/80">Due Date:</span>
                  <span className="font-semibold">
                    {new Date(feeData.currentMonth.dueDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Status:</span>
                  {feeData.currentMonth.status === 'paid' ? (
                    <span className="px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">✓ Paid</span>
                  ) : (
                    <span className="px-3 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-semibold">Pending</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              {feeData.currentMonth.status === 'pending' ? (
                <>
                  <button 
                    onClick={handlePayNow}
                    className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg mb-4"
                  >
                    Pay Now with Razorpay
                  </button>
                  <p className="text-sm text-white/80 text-center">
                    Secure payment via Razorpay • UPI, Cards, Net Banking accepted
                  </p>
                </>
              ) : (
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto text-green-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-semibold">Fee Paid!</p>
                  <p className="text-white/80 text-sm">Thank you for your timely payment</p>
                </div>
              )}
            </div>
          </div>

          {/* Grace Period Warning - NEW Phase 1 */}
          {feeData.currentMonth.status === 'pending' && 
           feeData.currentMonth.days_until_late_fee > 0 && 
           feeData.currentMonth.days_until_late_fee <= 10 && (
            <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-300/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="text-yellow-100 font-semibold">
                  ⏰ {feeData.currentMonth.days_until_late_fee} days left before late fee of ₹100 applies
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Fee</p>
                <p className="text-2xl font-bold text-accent">₹{feeData.monthlyFee}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-accent">₹{feeData.history.reduce((sum, p) => sum + p.total, 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payments Made</p>
                <p className="text-2xl font-bold text-accent">{feeData.history.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History - UPDATED with Phase 1 columns */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Payment History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-accent">Month</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Base Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Discount</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Late Fee</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Paid Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feeData.history.map((payment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{payment.month}</td>
                    <td className="py-3 px-4">₹{payment.base_amount}</td>
                    <td className="py-3 px-4">
                      {payment.discount > 0 ? (
                        <span className="text-green-600 font-semibold">{payment.discount}%</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary">₹{payment.amount}</td>
                    <td className="py-3 px-4">
                      {payment.late_fee > 0 ? (
                        <span className="text-red-600 font-semibold">+ ₹{payment.late_fee}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold">₹{payment.total}</td>
                    <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(payment.paidDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary hover:text-primary-dark text-sm font-semibold">
                        Download Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-3">💳 Payment Methods</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                UPI (Google Pay, PhonePe, Paytm)
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Credit/Debit Cards
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Net Banking
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Wallets
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">📌 Important Notes</h3>
            <ul className="space-y-2 text-sm text-yellow-800">
              <li>• Fee is due by the 5th of every month/quarter</li>
              <li>• Grace period: 10 days before late fee applies</li>
              <li>• Late fee: ₹100 after grace period</li>
              <li>• All transactions are secure via Razorpay</li>
              <li>• Receipt will be sent to your registered email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
