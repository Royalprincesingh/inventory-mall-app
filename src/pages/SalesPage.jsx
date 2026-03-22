import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { salesService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'
import toast from 'react-hot-toast'

export function SalesPage() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    unitPrice: '',
    totalAmount: '',
    paymentMethod: 'cash',
    notes: '',
  })

  useEffect(() => {
    fetchSales()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      const data = await salesService.getSales(thirtyDaysAgo, today)
      setSales(data)
    } catch (error) {
      toast.error('Failed to load sales')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleRecordSale = async (e) => {
    e.preventDefault()
    try {
      const saleData = {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalAmount: parseFloat(formData.totalAmount),
      }
      const id = await salesService.recordSale(saleData)
      setSales([...sales, { id, ...saleData }])
      setShowModal(false)
      setFormData({
        productName: '',
        quantity: '',
        unitPrice: '',
        totalAmount: '',
        paymentMethod: 'cash',
        notes: '',
      })
      toast.success('Sale recorded successfully')
    } catch (error) {
      toast.error('Failed to record sale')
      console.error(error)
    }
  }

  const calculateTotal = () => {
    return (parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Sales</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Record Sale
        </button>
      </div>

      {/* Sales Table */}
      <div className="card">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 dark:border-secondary-700">
                  <th className="table-header text-left">Product</th>
                  <th className="table-header text-right">Qty</th>
                  <th className="table-header text-right">Unit Price</th>
                  <th className="table-header text-right">Total Amount</th>
                  <th className="table-header text-left">Payment</th>
                  <th className="table-header text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} className="table-row">
                    <td className="px-4 py-3 font-medium">{sale.productName}</td>
                    <td className="px-4 py-3 text-right">{sale.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatters.formatCurrency(sale.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">{formatters.formatCurrency(sale.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-success">{sale.paymentMethod?.toUpperCase()}</span>
                    </td>
                    <td className="px-4 py-3">{formatters.formatDateTime(sale.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-white dark:bg-secondary-800 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Record Sale</h2>
            <form onSubmit={handleRecordSale} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={formData.productName}
                onChange={(e) => setFormData({...formData, productName: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={formData.unitPrice}
                onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
                className="input-field"
                required
                step="0.01"
              />
              <div className="p-3 bg-secondary-100 dark:bg-secondary-700 rounded-lg">
                <p className="text-sm text-secondary-600 dark:text-secondary-400">Total Amount</p>
                <p className="text-2xl font-bold text-primary-600">{formatters.formatCurrency(calculateTotal())}</p>
              </div>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="input-field"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
              </select>
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="input-field"
                rows="2"
              />
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Record Sale</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
