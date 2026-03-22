import { useState, useEffect } from 'react'
import { Download } from 'lucide-react'
import { productService, salesService } from '../services/firebaseService'
import { calculateStats, formatters } from '../utils/helpers'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

export function ReportsPage() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('monthly')

  useEffect(() => {
    generateReport()
  }, [reportType])

  const generateReport = async () => {
    try {
      setLoading(true)
      const today = new Date()
      let startDate, endDate

      switch (reportType) {
        case 'daily':
          startDate = new Date(today)
          startDate.setHours(0, 0, 0, 0)
          endDate = new Date(today)
          endDate.setHours(23, 59, 59, 999)
          break
        case 'weekly':
          startDate = new Date(today)
          startDate.setDate(today.getDate() - 7)
          endDate = today
          break
        case 'monthly':
        default:
          startDate = new Date(today)
          startDate.setMonth(today.getMonth())
          startDate.setDate(1)
          endDate = today
          break
      }

      const [products, sales] = await Promise.all([
        productService.getAllProducts(),
        salesService.getSales(startDate, endDate),
      ])

      const totalRevenue = calculateStats.calculateRevenue(sales)
      const topProducts = calculateStats.getTopSellingProducts(sales)
      const slowMoving = calculateStats.getSlowMovingProducts(products)
      const inventoryValue = calculateStats.calculateInventoryValue(products)

      setReportData({
        period: reportType,
        dateRange: `${formatters.formatDate(startDate)} - ${formatters.formatDate(endDate)}`,
        totalSales: sales.length,
        totalRevenue,
        totalProducts: products.length,
        inventoryValue,
        topProducts: topProducts.slice(0, 5),
        slowMovingProducts: slowMoving.slice(0, 5),
        lowStockProducts: products.filter(p => p.quantity < p.minStock).length,
      })
    } catch (error) {
      toast.error('Failed to generate report')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    if (!reportData) return
    
    const csvContent = [
      ['Inventory Report'],
      ['Period', reportData.period.toUpperCase()],
      ['Date Range', reportData.dateRange],
      [],
      ['Summary Metrics'],
      ['Total Sales', reportData.totalSales],
      ['Total Revenue', formatters.formatCurrency(reportData.totalRevenue)],
      ['Total Products', reportData.totalProducts],
      ['Inventory Value', formatters.formatCurrency(reportData.inventoryValue)],
      ['Low Stock Items', reportData.lowStockProducts],
      [],
      ['Top Selling Products'],
      ['Product Name', 'Quantity Sold', 'Revenue'],
      ...reportData.topProducts.map(p => [p.productName, p.quantity, formatters.formatCurrency(p.revenue)]),
      [],
      ['Slow Moving Products'],
      ['Product Name', 'Units Sold'],
      ...reportData.slowMovingProducts.map(p => [p.name, p.soldUnits || 0]),
    ]
      .map(row => row.join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${reportData.period}-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Report exported successfully')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Reports</h1>
        <button onClick={handleExportReport} className="btn-secondary flex items-center gap-2">
          <Download size={18} /> Export Report
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-4">
        {['daily', 'weekly', 'monthly'].map(type => (
          <button
            key={type}
            onClick={() => setReportType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              reportType === type
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">Total Sales</p>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">{reportData.totalSales}</p>
            </div>
            <div className="card">
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatters.formatCurrency(reportData.totalRevenue)}</p>
            </div>
            <div className="card">
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-primary-600">{reportData.totalProducts}</p>
            </div>
            <div className="card">
              <p className="text-secondary-600 dark:text-secondary-400 text-sm">Inventory Value</p>
              <p className="text-2xl font-bold text-orange-600">{formatters.formatCurrency(reportData.inventoryValue)}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Top Selling Products</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Low Stock Alert */}
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Inventory Status</h3>
              <div className="space-y-4">
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">Low Stock Items</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{reportData.lowStockProducts}</p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">Optimal Stock Products</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {reportData.totalProducts - reportData.lowStockProducts}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Slow Moving Products */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">Slow Moving Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200 dark:border-secondary-700">
                    <th className="table-header text-left">Product Name</th>
                    <th className="table-header text-right">Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.slowMovingProducts.map((product, idx) => (
                    <tr key={idx} className="table-row">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3 text-right font-semibold text-orange-600">
                        {product.soldUnits || 0} units
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
