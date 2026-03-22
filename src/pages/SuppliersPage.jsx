import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { supplierService } from '../services/firebaseService'
import toast from 'react-hot-toast'

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    paymentTerms: '',
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const data = await supplierService.getAllSuppliers()
      setSuppliers(data)
    } catch (error) {
      toast.error('Failed to load suppliers')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplier = async (e) => {
    e.preventDefault()
    try {
      const id = await supplierService.addSupplier(formData)
      setSuppliers([...suppliers, { id, ...formData }])
      setShowModal(false)
      setFormData({
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        paymentTerms: '',
      })
      toast.success('Supplier added successfully')
    } catch (error) {
      toast.error('Failed to add supplier')
      console.error(error)
    }
  }

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm('Are you sure?')) return
    
    try {
      await supplierService.deleteSupplier(supplierId)
      setSuppliers(suppliers.filter(s => s.id !== supplierId))
      toast.success('Supplier deleted')
    } catch (error) {
      toast.error('Failed to delete supplier')
      console.error(error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Suppliers</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Supplier
        </button>
      </div>

      {/* Suppliers Table */}
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
                  <th className="table-header text-left">Supplier Name</th>
                  <th className="table-header text-left">Contact Person</th>
                  <th className="table-header text-left">Phone</th>
                  <th className="table-header text-left">Email</th>
                  <th className="table-header text-left">City</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id} className="table-row">
                    <td className="px-4 py-3 font-medium">{supplier.name}</td>
                    <td className="px-4 py-3">{supplier.contactPerson}</td>
                    <td className="px-4 py-3">{supplier.phone}</td>
                    <td className="px-4 py-3">{supplier.email}</td>
                    <td className="px-4 py-3">{supplier.city}</td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      <button className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                        <Edit size={16} className="text-primary-600" />
                      </button>
                      <button onClick={() => handleDeleteSupplier(supplier.id)} className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                        <Trash2 size={16} className="text-danger" />
                      </button>
                    </td>
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
            <h2 className="text-2xl font-bold mb-4">Add New Supplier</h2>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <input
                type="text"
                placeholder="Company Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                className="input-field"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="input-field"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
              />
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="input-field"
                rows="2"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Payment Terms (e.g., 30 days Net)"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                className="input-field"
              />
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Add Supplier</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
