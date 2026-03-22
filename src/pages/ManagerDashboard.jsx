import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { productService, storeService, salesService, orderService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'

export function ManagerDashboard() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState({
    productsInStore: 0,
    todaysSales: 0,
    monthlyRevenue: 0,
    lowStockCount: 0,
    pendingOrders: 0,
  })
  const [chartData, setChartData] = useState([])
  const [storeInfo, setStoreInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const products = await productService.getAllProducts()
        const lowStockProducts = products.filter(p => p.quantity < p.minStock)
        const stores = await storeService.getAllStores()
        
        // Get manager's store (first store for demo)
        const managerStore = stores[0]
        setStoreInfo(managerStore)

        const today = new Date()
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const sales = await salesService.getSales(sevenDaysAgo, today)
        const orders = await orderService.getAllOrders()
        
        const todaysSalesData = await salesService.getDailySales(today)
        const todayRevenue = todaysSalesData.reduce((sum, sale) => sum + (sale.amount || 0), 0)
        const monthRevenue = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
        const pendingOrdersCount = orders.filter(o => o.status === 'pending').length

        setStats({
          productsInStore: products.length,
          todaysSales: todayRevenue,
          monthlyRevenue: monthRevenue,
          lowStockCount: lowStockProducts.length,
          pendingOrders: pendingOrdersCount,
        })

        const dailyData = {}
        sales.forEach(sale => {
          const date = sale.createdAt?.toDate?.()?.toLocaleDateString() || new Date(sale.createdAt).toLocaleDateString()
          dailyData[date] = (dailyData[date] || 0) + (sale.amount || 0)
        })

        setChartData(
          Object.entries(dailyData).map(([date, amount]) => ({
            date,
            amount,
          }))
        )
      } catch (error) {
        console.error('Error fetching manager dashboard data:', error)
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
          <p className="text-secondary-600 dark:text-secondary-400">Loading Manager Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">Manager Dashboard</h1>
        {storeInfo && (
          <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mt-1 truncate">Store: {storeInfo.name}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
        <StatCard label="Products in Store" value={formatters.formatNumber(stats.productsInStore)} />
        <StatCard label="Today's Sales" value={formatters.formatCurrency(stats.todaysSales)} />
        <StatCard label="Monthly Revenue" value={formatters.formatCurrency(stats.monthlyRevenue)} />
        <StatCard label="Low Stock" value={formatters.formatNumber(stats.lowStockCount)} />
        <StatCard label="Pending Orders" value={formatters.formatNumber(stats.pendingOrders)} />
      </div>

      {/* Store Info */}
      {storeInfo && (
        <div className="card">
          <h2 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white mb-4">Store Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">Store Name</p>
              <p className="text-base sm:text-lg font-medium text-secondary-900 dark:text-white mt-1 truncate">{storeInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Location</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white mt-1">{storeInfo.location}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Manager</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white mt-1">{storeInfo.manager}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Contact</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white mt-1">{storeInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Opening Hours</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white mt-1">{storeInfo.openingTime} - {storeInfo.closingTime}</p>
            </div>
            <div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Email</p>
              <p className="text-lg font-medium text-secondary-900 dark:text-white mt-1">{storeInfo.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sales Chart */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white mb-4">Sales Trend (Last 7 Days)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Revenue" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Action Items */}
      <div className="card">
        <h2 className="text-base sm:text-lg font-semibold text-secondary-900 dark:text-white mb-4">Action Items</h2>
        <div className="space-y-2 sm:space-y-3">
          {stats.lowStockCount > 0 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 flex items-start">
              <AlertTriangle className="text-yellow-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">{stats.lowStockCount} Products Low on Stock</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-200 mt-1">Review and reorder stock items</p>
              </div>
            </div>
          )}
          {stats.pendingOrders > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 flex items-start">
              <ShoppingCart className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">{stats.pendingOrders} Pending Orders</p>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">Check supplier orders for updates</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
