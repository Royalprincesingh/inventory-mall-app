import { useState, useEffect } from 'react'
import { Plus, Search, Download, Filter, Trash2, Edit } from 'lucide-react'
import { productService, categoryService } from '../services/firebaseService'
import { formatters } from '../utils/helpers'
import toast from 'react-hot-toast'

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    brand: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    minStock: '',
    description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ])
        setProducts(productsData)
        setFilteredProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        toast.error('Failed to load products')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Handle search and filter
  useEffect(() => {
    let filtered = products
    
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    
    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, products])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const newProduct = {
        ...formData,
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        quantity: parseInt(formData.quantity),
        minStock: parseInt(formData.minStock),
        sku: formData.sku || formatters.generateSKU(),
        barcode: formData.barcode || formatters.generateBarcode(),
      }
      
      const id = await productService.addProduct(newProduct)
      setProducts([...products, { id, ...newProduct }])
      setShowModal(false)
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        brand: '',
        costPrice: '',
        sellingPrice: '',
        quantity: '',
        minStock: '',
        description: '',
      })
      toast.success('Product added successfully')
    } catch (error) {
      toast.error('Failed to add product')
      console.error(error)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure?')) return
    
    try {
      await productService.deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      toast.success('Product deleted')
    } catch (error) {
      toast.error('Failed to delete product')
      console.error(error)
    }
  }

  const handleExport = () => {
    const exportData = filteredProducts.map(p => ({
      'Product Name': p.name,
      'SKU': p.sku,
      'Barcode': p.barcode,
      'Category': p.category,
      'Cost Price': formatters.formatCurrency(p.costPrice),
      'Selling Price': formatters.formatCurrency(p.sellingPrice),
      'Quantity': p.quantity,
      'Min Stock': p.minStock,
      'Status': p.quantity < p.minStock ? 'Low Stock' : 'OK',
    }))
    
    const csv = [
      Object.keys(exportData[0]),
      ...exportData.map(item => Object.values(item)),
    ]
      .map(row => row.join(','))
      .join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success('Exported successfully')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">Products</h1>
        <div className="flex gap-2">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2">
            <Download size={18} /> Export
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-secondary-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field md:w-48"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
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
                  <th className="table-header text-left">SKU</th>
                  <th className="table-header text-right">Cost</th>
                  <th className="table-header text-right">Selling</th>
                  <th className="table-header text-right">Qty</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} className="table-row">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 text-right">{formatters.formatCurrency(product.costPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-green-600">{formatters.formatCurrency(product.sellingPrice)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{product.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      {product.quantity < product.minStock ? (
                        <span className="badge badge-warning">Low Stock</span>
                      ) : product.quantity === 0 ? (
                        <span className="badge badge-danger">Out</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center flex gap-2 justify-center">
                      <button className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
                        <Edit size={16} className="text-primary-600" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded">
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
          <div className="card bg-white dark:bg-secondary-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="input-field"
                  required
                />
                <input
                  type="text"
                  placeholder="SKU (auto-generated)"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Barcode"
                  value={formData.barcode}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                  className="input-field"
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Brand"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                  className="input-field"
                />
                <input
                  type="number"
                  placeholder="Cost Price"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                  className="input-field"
                  required
                />
                <input
                  type="number"
                  placeholder="Selling Price"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({...formData, sellingPrice: e.target.value})}
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
                  placeholder="Min Stock Level"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                  className="input-field"
                  required
                />
              </div>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="input-field"
                rows="3"
              />
              <div className="flex gap-4">
                <button type="submit" className="btn-primary flex-1">Add Product</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
