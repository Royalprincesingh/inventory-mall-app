import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { orderService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'
import toast from 'react-hot-toast'

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    supplier: '',
    totalAmount: '',
    status: 'pending',
    expectedDelivery: '',
    notes: '',
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch (error) {
      toast.error('Failed to load orders')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    try {
      const id = await orderService.createOrder({
        ...formData,
        totalAmount: parseFloat(formData.totalAmount),
      })
      setOrders([...orders, { id, ...formData }])
      setShowModal(false)
      setFormData({
        supplier: '',
        totalAmount: '',
        status: 'pending',
        expectedDelivery: '',
        notes: '',
      })
      toast.success('Order created successfully')
    } catch (error) {
      toast.error('Failed to create order')
      console.error(error)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-warning'
      case 'delivered':
        return 'badge-success'
      case 'cancelled':
        return 'badge-danger'
      default:
        return 'badge-secondary'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Purchase Orders</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Order
        </button>
      </div>

      {/* Orders Table */}
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
                  <th className="table-header text-left">Order ID</th>
                  <th className="table-header text-left">Supplier</th>
                  <th className="table-header text-right">Amount</th>
                  <th className="table-header text-left">Expected Delivery</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="table-row">
                    <td className="px-4 py-3 font-mono text-xs">{order.id?.substring(0, 8)}</td>
                    <td className="px-4 py-3">{order.supplier}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatters.formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">{order.expectedDelivery}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`badge ${getStatusColor(order.status)}`}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatters.formatDate(order.createdAt)}</td>
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
            <h2 className="text-2xl font-bold mb-4">Create Purchase Order</h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <input
                type="text"
                placeholder="Supplier Name"
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="number"
                placeholder="Total Amount"
                value={formData.totalAmount}
                onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                className="input-field"
                required
                step="0.01"
              />
              <input
                type="date"
                placeholder="Expected Delivery"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({...formData, expectedDelivery: e.target.value})}
                className="input-field"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="input-field"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <textarea
                placeholder="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="input-field"
                rows="3"
              />
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Create Order</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
