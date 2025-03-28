import React, { useState } from 'react';
import SideBar from '../../sideBar';

const PaymentHistory = () => {
  // Sample payment history data
  const initialPayments = [
    {
      id: 1,
      date: '2023-11-15',
      therapist: 'Dr. Kemunto Nyamweya',
      sessionType: 'Online',
      amount: 75,
      status: 'Completed',
      paymentMethod: 'Credit Card'
    },
    {
      id: 2,
      date: '2023-10-28',
      therapist: 'Dr. Njoki Nyamweya',
      sessionType: 'In-Person',
      amount: 90,
      status: 'Completed',
      paymentMethod: 'PayPal'
    },
    {
      id: 3,
      date: '2023-09-12',
      therapist: 'Dr. Kemunto Nyamweya',
      sessionType: 'Online',
      amount: 75,
      status: 'Refunded',
      paymentMethod: 'Credit Card'
    },
    {
      id: 4,
      date: '2023-08-05',
      therapist: 'Dr. Wanjiku Mwangi',
      sessionType: 'In-Person',
      amount: 85,
      status: 'Failed',
      paymentMethod: 'M-Pesa'
    },
    {
      id: 5,
      date: '2023-07-22',
      therapist: 'Dr. Njoki Nyamweya',
      sessionType: 'Online',
      amount: 75,
      status: 'Completed',
      paymentMethod: 'Credit Card'
    },
  ];

  const [payments, setPayments] = useState(initialPayments);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter payments based on status and search term
  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status.toLowerCase() === filter;
    const matchesSearch = payment.therapist.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Completed: 'bg-green-100 text-green-800',
      Refunded: 'bg-blue-100 text-blue-800',
      Failed: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <SideBar>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Payment History</h1>
          <p className="text-gray-600">View and manage your past transactions</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('refunded')}
              className={`px-4 py-2 rounded-lg ${filter === 'refunded' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Refunded
            </button>
            <button
              onClick={() => setFilter('failed')}
              className={`px-4 py-2 rounded-lg ${filter === 'failed' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Failed
            </button>
          </div>

          <div className="w-full md:w-auto">
            <input
              type="text"
              placeholder="Search therapist or method..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Therapist</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.therapist}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.sessionType}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <StatusBadge status={payment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-purple-600 hover:text-purple-900 mr-4">Receipt</button>
                        {payment.status === 'Failed' && (
                          <button className="text-red-600 hover:text-red-900">Retry</button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No payments found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{payments.length}</span> payments
              </div>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Export History
              </button>
            </div>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default PaymentHistory;