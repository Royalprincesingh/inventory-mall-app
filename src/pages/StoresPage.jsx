import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit } from 'lucide-react'
import { storeService } from '../services/firebaseService'
import toast from 'react-hot-toast'

export function StoresPage() {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    manager: '',
    openingTime: '',
    closingTime: '',
  })

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const data = await storeService.getAllStores()
      setStores(data)
    } catch (error) {
      toast.error('Failed to load stores')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStore = async (e) => {
    e.preventDefault()
    try {
      const id = await storeService.addStore(formData)
      setStores([...stores, { id, ...formData }])
      setShowModal(false)
      setFormData({
        name: '',
        location: '',
        phone: '',
        email: '',
        manager: '',
        openingTime: '',
        closingTime: '',
      })
      toast.success('Store added successfully')
    } catch (error) {
      toast.error('Failed to add store')
      console.error(error)
    }
  }

  const handleDeleteStore = async (storeId) => {
    if (!window.confirm('Are you sure?')) return
    
    try {
      await storeService.deleteStore(storeId)
      setStores(stores.filter(s => s.id !== storeId))
      toast.success('Store deleted')
    } catch (error) {
      toast.error('Failed to delete store')
      console.error(error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Stores</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Store
        </button>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : stores.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-secondary-500">
            No stores added yet
          </div>
        ) : (
          stores.map(store => (
            <div key={store.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-secondary-900 dark:text-white">{store.name}</h3>
                  <p className="text-sm text-secondary-500">{store.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                    <Edit size={16} className="text-primary-600" />
                  </button>
                  <button onClick={() => handleDeleteStore(store.id)} className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                    <Trash2 size={16} className="text-danger" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><strong>Manager:</strong> {store.manager}</p>
                <p><strong>Phone:</strong> {store.phone}</p>
                <p><strong>Email:</strong> {store.email}</p>
                <p><strong>Hours:</strong> {store.openingTime} - {store.closingTime}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-white dark:bg-secondary-800 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Store</h2>
            <form onSubmit={handleAddStore} className="space-y-4">
              <input
                type="text"
                placeholder="Store Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Manager Name"
                value={formData.manager}
                onChange={(e) => setFormData({...formData, manager: e.target.value})}
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
              <input
                type="time"
                placeholder="Opening Time"
                value={formData.openingTime}
                onChange={(e) => setFormData({...formData, openingTime: e.target.value})}
                className="input-field"
              />
              <input
                type="time"
                placeholder="Closing Time"
                value={formData.closingTime}
                onChange={(e) => setFormData({...formData, closingTime: e.target.value})}
                className="input-field"
              />
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Add Store</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
