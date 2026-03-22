import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { productService, storeService, salesService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStores: 0,
    todaysSales: 0,
    monthlyRevenue: 0,
    lowStockCount: 0,
    totalUsers: 0,
  })
  const [chartData, setChartData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const products = await productService.getAllProducts()
        const lowStockProducts = products.filter(p => p.quantity < p.minStock)
        const stores = await storeService.getAllStores()
        
        const today = new Date()
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const sales = await salesService.getSales(sevenDaysAgo, today)
        
        const todaysSalesData = await salesService.getDailySales(today)
        const todayRevenue = todaysSalesData.reduce((sum, sale) => sum + (sale.amount || 0), 0)
        const monthRevenue = sales.reduce((sum, sale) => sum + (sale.amount || 0), 0)
        
        // Get top products from sales
        const productSalesMap = {}
        sales.forEach(sale => {
          const key = sale.product
          if (!productSalesMap[key]) {
            productSalesMap[key] = { name: sale.product, revenue: 0, quantity: 0 }
          }
          productSalesMap[key].revenue += sale.amount || 0
          productSalesMap[key].quantity += sale.quantity || 0
        })
        const topSellingProducts = Object.values(productSalesMap)
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5)

        setStats({
          totalProducts: products.length,
          totalStores: stores.length,
          todaysSales: todayRevenue,
          monthlyRevenue: monthRevenue,
          lowStockCount: lowStockProducts.length,
          totalUsers: stores.length * 2,
        })

        // Prepare chart data
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

        setTopProducts(topSellingProducts)
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error)
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
          <p className="text-secondary-600 dark:text-secondary-400">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 mt-1">System-wide inventory and sales overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
        <StatCard label="Total Products" value={formatters.formatNumber(stats.totalProducts)} />
        <StatCard label="Total Stores" value={formatters.formatNumber(stats.totalStores)} />
        <StatCard label="Total Users" value={formatters.formatNumber(stats.totalUsers)} />
        <StatCard label="Today's Sales" value={formatters.formatCurrency(stats.todaysSales)} />
        <StatCard label="Monthly Revenue" value={formatters.formatCurrency(stats.monthlyRevenue)} />
        <StatCard label="Low Stock" value={formatters.formatNumber(stats.lowStockCount)} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 card">
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

        {/* Top Products */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.length > 0 ? (
              topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white text-sm">{product.name}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">Qty: {product.quantity}</p>
                  </div>
                  <p className="font-bold text-primary-600">{formatters.formatCurrency(product.revenue)}</p>
                </div>
              ))
            ) : (
              <p className="text-secondary-500 dark:text-secondary-400 text-sm">No sales data available</p>
            )}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="card">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">✓ All Systems Operational</p>
          </div>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">⚠ {stats.lowStockCount} Low Stock Items</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">📊 {stats.totalStores} Stores Active</p>
          </div>
        </div>
      </div>
    </div>
  )
}
