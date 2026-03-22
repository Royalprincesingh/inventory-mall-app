import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Barcode, ShoppingCart, Package, TrendingUp, Activity } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import inventoryLogService from '../services/inventoryLogService';

const ScanProductPage = () => {
  const [stats, setStats] = useState({
    totalStockIn: 0,
    totalSales: 0,
    totalAdjustments: 0,
    totalTransactions: 0,
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Load recent logs
        try {
          const logs = await inventoryLogService.getRecentLogs('Main Store', 10);
          setRecentLogs(logs || []);
        } catch (logErr) {
          console.warn('Could not load logs:', logErr.message);
          setRecentLogs([]); // Fallback to empty
        }

        // Calculate stats
        try {
          const summary = await inventoryLogService.getInventorySummary('Main Store');
          if (summary) {
            setStats(summary);
          }
        } catch (summaryErr) {
          console.warn('Could not load summary:', summaryErr.message);
          // Keep default empty stats
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        // Don't show error toast - let dashboard work with empty data
        setRecentLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color = 'primary' }) => (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary-600 dark:text-secondary-400 text-sm font-medium">
            {label}
          </p>
          <p className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div
          className={`p-3 rounded-lg ${
            color === 'green'
              ? 'bg-green-100 dark:bg-green-900/30'
              : color === 'red'
              ? 'bg-red-100 dark:bg-red-900/30'
              : 'bg-primary-100 dark:bg-primary-900/30'
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              color === 'green'
                ? 'text-green-600 dark:text-green-400'
                : color === 'red'
                ? 'text-red-600 dark:text-red-400'
                : 'text-primary-600 dark:text-primary-400'
            }`}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Barcode className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
                Barcode Scanning
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                Quick access to inventory scanning operations
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            to="/stock-in"
            className="card hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Stock In
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 mt-2">
                  Receive and add inventory to stock using barcode scanning
                </p>
              </div>
            </div>
            <div className="mt-4 inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium">
              Open Scanner →
            </div>
          </Link>

          <Link
            to="/sales-scan"
            className="card hover:shadow-lg transition transform hover:scale-105 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-red-600" />
                  Sales Scan
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400 mt-2">
                  Scan products and complete sales transactions instantly
                </p>
              </div>
            </div>
            <div className="mt-4 inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
              Open POS →
            </div>
          </Link>
        </div>

        {/* Stats Grid */}
        {!isLoading && (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={Package}
                label="Total Stock In"
                value={stats.totalStockIn}
                color="green"
              />
              <StatCard
                icon={ShoppingCart}
                label="Total Sales"
                value={stats.totalSales}
                color="red"
              />
              <StatCard
                icon={TrendingUp}
                label="Adjustments"
                value={stats.totalAdjustments}
                color="primary"
              />
              <StatCard
                icon={Activity}
                label="Transactions"
                value={stats.totalTransactions}
                color="primary"
              />
            </div>

            {/* Recent Activity */}
            {recentLogs.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-secondary-200 dark:border-secondary-700">
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700 dark:text-secondary-300">
                          Product
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700 dark:text-secondary-300">
                          Type
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-secondary-700 dark:text-secondary-300">
                          Quantity
                        </th>
                        <th className="text-right py-3 px-4 font-semibold text-secondary-700 dark:text-secondary-300">
                          Stock
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700 dark:text-secondary-300">
                          Staff
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-700 dark:text-secondary-300">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
                      {recentLogs.map((log) => {
                        const typeColors = {
                          stock_in: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400',
                          sale: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                          adjustment:
                            'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
                        };

                        const typeLabels = {
                          stock_in: 'Stock In',
                          sale: 'Sale',
                          adjustment: 'Adjustment',
                        };

                        const typeBadgeClass =
                          typeColors[log.type] ||
                          'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400';

                        return (
                          <tr
                            key={log.id}
                            className="hover:bg-secondary-50 dark:hover:bg-secondary-800 transition"
                          >
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-secondary-900 dark:text-white">
                                  {log.productName}
                                </p>
                                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                                  {log.barcode}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${typeBadgeClass}`}
                              >
                                {typeLabels[log.type]}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span
                                className={`font-semibold ${
                                  log.quantity > 0
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                }`}
                              >
                                {log.quantity > 0 ? '+' : ''}
                                {log.quantity}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <span className="font-medium text-secondary-900 dark:text-white">
                                {log.newStock}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-secondary-600 dark:text-secondary-400">
                              {log.staffName}
                            </td>
                            <td className="py-3 px-4 text-sm text-secondary-600 dark:text-secondary-400">
                              {log.timestamp
                                ? new Date(
                                    log.timestamp.seconds * 1000
                                  ).toLocaleString('en-IN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="card flex items-center justify-center py-12">
            <p className="text-secondary-600 dark:text-secondary-400">
              Loading dashboard...
            </p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Barcode className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Fast Scanning
              </h3>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm">
              Use your mobile camera to scan product barcodes instantly with real-time
              product lookup
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Stock Management
              </h3>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm">
              Automatically update inventory levels with atomic transactions ensuring data
              consistency
            </p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 dark:text-white">
                Complete Audit Trail
              </h3>
            </div>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm">
              Track all inventory movements with detailed logs including staff, quantity,
              and timestamps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScanProductPage;
