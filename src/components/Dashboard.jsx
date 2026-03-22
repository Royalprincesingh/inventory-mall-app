import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, AlertTriangle, Package, Store } from 'lucide-react'
import { productService, storeService, salesService } from '../services/firebaseService'
import { formatters, calculateStats } from '../utils/helpers'

export function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStores: 0,
    todaysSales: 0,
    monthlyRevenue: 0,
    lowStockCount: 0,
  })
  const [chartData, setChartData] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch products
        const products = await productService.getAllProducts()
        const lowStockProducts = await productService.getLowStockProducts()
        
        // Fetch stores
        const stores = await storeService.getAllStores()
        
        // Fetch sales data (last 7 days)
        const today = new Date()
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const sales = await salesService.getSales(sevenDaysAgo, today)
        
        // Calculate stats
        const todaysSalesData = await salesService.getDailySales(today)
        const todayRevenue = calculateStats.calculateRevenue(todaysSalesData)
        const monthRevenue = calculateStats.calculateRevenue(sales)
        const topSellingProducts = calculateStats.getTopSellingProducts(sales).slice(0, 5)

        setStats({
          totalProducts: products.length,
          totalStores: stores.length,
          todaysSales: todayRevenue,
          monthlyRevenue: monthRevenue,
          lowStockCount: lowStockProducts.length,
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
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card bg-gradient-to-br from-white to-secondary-50 dark:from-secondary-800 dark:to-secondary-900 hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-600 dark:text-secondary-400 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Package}
          label="Total Products"
          value={formatters.formatNumber(stats.totalProducts)}
          color="bg-blue-500"
        />
        <StatCard
          icon={Store}
          label="Total Stores"
          value={formatters.formatNumber(stats.totalStores)}
          color="bg-green-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Today's Sales"
          value={formatters.formatCurrency(stats.todaysSales)}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Monthly Revenue"
          value={formatters.formatCurrency(stats.monthlyRevenue)}
          color="bg-orange-500"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={formatters.formatNumber(stats.lowStockCount)}
          color="bg-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Trend */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Sales Trend (Last 7 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
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

        {/* Top Categories */}
        <div className="card">
          <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">In Stock</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Low Stock Items</p>
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.lowStockCount}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">Active Stores</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.totalStores}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="card">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200 dark:border-secondary-700">
                <th className="table-header text-left">Product Name</th>
                <th className="table-header text-right">Quantity Sold</th>
                <th className="table-header text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map(product => (
                <tr key={product.productId} className="table-row">
                  <td className="px-4 py-3">{product.productName}</td>
                  <td className="px-4 py-3 text-right font-medium">{product.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">
                    {formatters.formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
