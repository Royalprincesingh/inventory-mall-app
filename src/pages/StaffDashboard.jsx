import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { productService, salesService, logService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'

export function StaffDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    totalSalesDay: 0,
    itemsSoldToday: 0,
    lowStockItems: 0,
    lastRestockTime: 'N/A',
  })
  const [topProducts, setTopProducts] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const products = await productService.getAllProducts()
        const lowStockProducts = products.filter(p => p.quantity < p.minStock)
        
        const today = new Date()
        const todaysSalesData = await salesService.getDailySales(today)
        const logs = await logService.getAllLogs()

        const todayRevenue = todaysSalesData.reduce((sum, sale) => sum + (sale.amount || 0), 0)
        const itemsSold = todaysSalesData.reduce((sum, sale) => sum + (sale.quantity || 1), 0)
        
        // Get top products from today's sales
        const productSalesMap = {}
        todaysSalesData.forEach(sale => {
          const key = sale.product
          if (!productSalesMap[key]) {
            productSalesMap[key] = { name: sale.product, revenue: 0, quantity: 0, sku: 'SKU-000' }
          }
          productSalesMap[key].revenue += sale.amount || 0
          productSalesMap[key].quantity += sale.quantity || 0
        })
        const topSellingProducts = Object.values(productSalesMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setStats({
          totalSalesDay: todayRevenue,
          itemsSoldToday: itemsSold,
          lowStockItems: lowStockProducts.length,
          lastRestockTime: '2 hours ago',
        })

        setTopProducts(topSellingProducts)
        setRecentActivities(logs.slice(0, 5))
      } catch (error) {
        console.error('Error fetching staff dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ label, value }) => (
    <div className="card bg-gradient-to-br from-white to-secondary-50 dark:from-secondary-800 dark:to-secondary-900 hover:shadow-elevated p-3 sm:p-4">
      <div>
        <p className="text-secondary-600 dark:text-secondary-400 text-xs sm:text-sm font-medium truncate">{label}</p>
        <p className="text-lg sm:text-2xl font-bold text-secondary-900 dark:text-white mt-2 truncate">{value}</p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading Staff Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">Staff Dashboard</h1>
        <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mt-1">Your daily sales and inventory summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <StatCard label="Today's Sales" value={formatters.formatCurrency(stats.totalSalesDay)} />
        <StatCard label="Items Sold" value={formatters.formatNumber(stats.itemsSoldToday)} />
        <StatCard label="Low Stock Items" value={formatters.formatNumber(stats.lowStockItems)} />
        <StatCard label="Last Restock" value={stats.lastRestockTime} />
      </div>

      {/* Top Selling Products */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white mb-4">Top Selling Products Today</h2>
        {topProducts.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-600 transition">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 font-bold text-xs sm:text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary-900 dark:text-white text-sm truncate">{product.name}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 truncate">{product.sku}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <p className="font-bold text-primary-600 dark:text-primary-400 text-sm">{product.quantity}</p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">{formatters.formatCurrency(product.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary-500 dark:text-secondary-400 text-sm py-4">No sales data available yet</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <button className="p-3 sm:p-4 border-2 border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition text-left">
            <p className="font-medium text-primary-600 dark:text-primary-400 text-sm">Record Sale</p>
            <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mt-1">Add a new sale transaction</p>
          </button>
          <button className="p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition text-left">
            <p className="font-medium text-orange-600 dark:text-orange-400">Report Issue</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">Report low stock or damage</p>
          </button>
          <button className="p-4 border-2 border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition text-left">
            <p className="font-medium text-green-600 dark:text-green-400">View Inventory</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">Check current stock levels</p>
          </button>
          <button className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-left">
            <p className="font-medium text-blue-600 dark:text-blue-400">My Schedule</p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">View your work schedule</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white mb-4">Recent Activity</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-1 sm:space-y-2">
            {recentActivities.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 text-sm border-b border-secondary-200 dark:border-secondary-700 last:border-b-0">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 mt-1.5"></div>
                <div className="flex-1">
                  <p className="text-secondary-900 dark:text-white font-medium">{activity.action}</p>
                  <p className="text-secondary-600 dark:text-secondary-400 text-xs mt-0.5">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-secondary-500 dark:text-secondary-400 text-sm py-4">No recent activity</p>
        )}
      </div>
    </div>
  )
}
