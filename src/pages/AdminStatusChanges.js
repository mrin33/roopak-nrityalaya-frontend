import React, { useState, useEffect } from 'react';

const AdminStatusChanges = () => {
  const [statusChanges, setStatusChanges] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // TODO: Fetch from API
    setStatusChanges([
      {
        id: 1,
        student_name: 'Riya Sharma',
        roll_number: 'PP1',
        change_type: 'enrollment',
        from_status: null,
        to_status: 'active',
        reason: 'New enrollment - interested in Kathak',
        changed_at: '2025-09-01T10:00:00'
      },
      {
        id: 2,
        student_name: 'Amit Kumar',
        roll_number: 'PP2',
        change_type: 'batch_switch',
        from_batch: 'Evening Batch A',
        to_batch: 'Morning Batch A',
        reason: 'Timing conflicts with school',
        changed_at: '2025-10-15T14:30:00'
      },
      {
        id: 3,
        student_name: 'Rahul Singh',
        roll_number: 'MP2',
        change_type: 'discontinuation',
        from_status: 'active',
        to_status: 'discontinued',
        reason: 'Relocation to another city',
        changed_at: '2025-12-20T11:00:00'
      },
      {
        id: 4,
        student_name: 'Priya Patel',
        roll_number: 'MP1',
        change_type: 'rejoining',
        from_status: 'discontinued',
        to_status: 'active',
        reason: 'Returned to the city, wants to continue learning',
        changed_at: '2026-01-10T09:00:00'
      }
    ]);
  }, []);

  const getTypeBadge = (type) => {
    switch(type) {
      case 'enrollment':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">New Enrollment</span>;
      case 'discontinuation':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Discontinuation</span>;
      case 'rejoining':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Rejoining</span>;
      case 'batch_switch':
        return <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">Batch Switch</span>;
      default:
        return null;
    }
  };

  const filteredChanges = filterType === 'all' 
    ? statusChanges 
    : statusChanges.filter(c => c.change_type === filterType);

  const stats = {
    enrollments: statusChanges.filter(c => c.change_type === 'enrollment').length,
    discontinuations: statusChanges.filter(c => c.change_type === 'discontinuation').length,
    rejoining: statusChanges.filter(c => c.change_type === 'rejoining').length,
    batchSwitches: statusChanges.filter(c => c.change_type === 'batch_switch').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Student Status Changes
          </h1>
          <p className="text-gray-600">Track all student enrollment and status changes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">New Enrollments</p>
            <p className="text-3xl font-bold text-green-600">{stats.enrollments}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Discontinuations</p>
            <p className="text-3xl font-bold text-red-600">{stats.discontinuations}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Rejoining</p>
            <p className="text-3xl font-bold text-blue-600">{stats.rejoining}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Batch Switches</p>
            <p className="text-3xl font-bold text-purple-600">{stats.batchSwitches}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredChanges.length} of {statusChanges.length} changes
            </p>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field w-64"
            >
              <option value="all">All Changes</option>
              <option value="enrollment">New Enrollments</option>
              <option value="discontinuation">Discontinuations</option>
              <option value="rejoining">Rejoining</option>
              <option value="batch_switch">Batch Switches</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {filteredChanges.map((change) => (
              <div key={change.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-accent">{change.student_name}</h3>
                      <span className="text-sm text-gray-500">({change.roll_number})</span>
                      {getTypeBadge(change.change_type)}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(change.changed_at).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {change.change_type === 'batch_switch' && (
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">FROM:</p>
                      <p className="font-semibold text-red-700">{change.from_batch}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TO:</p>
                      <p className="font-semibold text-green-700">{change.to_batch}</p>
                    </div>
                  </div>
                )}

                {(change.change_type === 'discontinuation' || change.change_type === 'rejoining') && (
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">FROM:</p>
                      <p className="font-semibold capitalize">{change.from_status || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TO:</p>
                      <p className="font-semibold capitalize">{change.to_status}</p>
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Reason:</p>
                  <p className="text-sm text-blue-800">{change.reason}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredChanges.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No status changes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStatusChanges;
