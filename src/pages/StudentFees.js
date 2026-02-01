import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentFees = () => {
  const { user } = useAuth();
  const [feeData, setFeeData] = useState({
    monthlyFee: 1000,
    currentMonth: {
      month: 'February 2026',
      amount: 1000,
      status: 'pending',
      dueDate: '2026-02-05'
    },
    history: []
  });

  useEffect(() => {
    // TODO: Fetch real fee data from API
    setFeeData({
      monthlyFee: 1000,
      currentMonth: {
        month: 'February 2026',
        amount: 1000,
        status: 'pending',
        dueDate: '2026-02-05'
      },
      history: [
        { month: 'January 2026', amount: 1000, status: 'paid', paidDate: '2026-01-03', paymentId: 'PAY001' },
        { month: 'December 2025', amount: 1000, status: 'paid', paidDate: '2025-12-02', paymentId: 'PAY002' },
        { month: 'November 2025', amount: 1000, status: 'paid', paidDate: '2025-11-04', paymentId: 'PAY003' },
        { month: 'October 2025', amount: 1000, status: 'paid', paidDate: '2025-10-01', paymentId: 'PAY004' },
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

        {/* Current Month Fee Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl shadow-2xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Current Month Fee</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Month:</span>
                  <span className="font-semibold">{feeData.currentMonth.month}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Amount:</span>
                  <span className="font-semibold text-2xl">₹{feeData.currentMonth.amount}</span>
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
                <p className="text-2xl font-bold text-accent">₹{feeData.history.length * 1000}</p>
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
                <p className="text-sm text-gray-600">Months Paid</p>
                <p className="text-2xl font-bold text-accent">{feeData.history.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-accent mb-6 pb-4 border-b">Payment History</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-accent">Month</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Paid Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Payment ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-accent">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feeData.history.map((payment, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium">{payment.month}</td>
                    <td className="py-3 px-4">₹{payment.amount}</td>
                    <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(payment.paidDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm font-mono">{payment.paymentId}</td>
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
              <li>• Fee is due by the 5th of every month</li>
              <li>• No late fee penalties currently</li>
              <li>• All transactions are secure via Razorpay</li>
              <li>• Receipt will be sent to your registered email</li>
              <li>• For queries, contact admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees;
