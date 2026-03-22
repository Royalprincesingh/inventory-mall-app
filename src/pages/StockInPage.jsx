import React, { useState } from 'react';
import { Scan, Plus, X, Check, AlertTriangle } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import BarcodeScanner from '../components/BarcodeScanner';
import barcodeService from '../services/barcodeService';
import stockService from '../services/stockService';
import { useAuth } from '../context/AuthContext';

const StockInPage = () => {
  const { currentUser } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [currentBarcode, setCurrentBarcode] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  // New product creation modal state
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    quantity: '0',
    sku: '',
  });

  // Close scanner and handle barcode
  const handleScanBarcode = async (barcode) => {
    setShowScanner(false);
    setCurrentBarcode(barcode);

    try {
      setIsLoading(true);
      const product = await barcodeService.findProductByBarcode(barcode);
      setCurrentProduct(product);
      setCurrentQuantity('1');
      toast.success(`Product found: ${product.name}`);
    } catch (error) {
      // Product not found - open modal to create new product
      toast.error(`Barcode '${barcode}' not found. Creating new product...`);
      setCurrentProduct(null);
      setNewProductForm({
        name: '',
        price: '',
        category: 'Electronics',
        quantity: '0',
        sku: '',
      });
      setShowCreateProductModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual search
  const handleSearch = async (searchTerm) => {
    setSearchInput(searchTerm);

    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await barcodeService.searchProducts(searchTerm);
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Select product from search results
  const selectProduct = (product) => {
    setCurrentProduct(product);
    setCurrentBarcode(product.barcode);
    setCurrentQuantity('1');
    setSearchInput('');
    setSearchResults([]);
    toast.success(`Product selected: ${product.name}`);
  };

  // Create new product with barcode
  const handleCreateProduct = async () => {
    if (!newProductForm.name || !newProductForm.price || !newProductForm.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const newProduct = await barcodeService.createProductWithBarcode({
        barcode: currentBarcode,
        name: newProductForm.name,
        price: newProductForm.price,
        category: newProductForm.category,
        quantity: newProductForm.quantity,
        sku: newProductForm.sku,
      });

      toast.success(`Product "${newProduct.name}" created!`);
      setCurrentProduct(newProduct);
      setShowCreateProductModal(false);
      setCurrentQuantity(newProductForm.quantity);
    } catch (error) {
      toast.error('Failed to create product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add scanned item to cart
  const addItem = async () => {
    if (!currentProduct) {
      toast.error('Please select a product');
      return;
    }

    const quantity = parseInt(currentQuantity);
    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // Check if product already in cart
    const existingItem = scannedItems.find(
      (item) => item.id === currentProduct.id
    );

    if (existingItem) {
      // Update quantity
      setScannedItems(
        scannedItems.map((item) =>
          item.id === currentProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success('Quantity updated');
    } else {
      // Add new item
      setScannedItems([
        ...scannedItems,
        {
          ...currentProduct,
          quantity,
          scannedAt: new Date(),
        },
      ]);
      toast.success(`${currentProduct.name} added to stock in`);
    }

    // Reset form
    setCurrentBarcode('');
    setCurrentQuantity('');
    setCurrentProduct(null);
  };

  // Remove item from cart
  const removeItem = (productId) => {
    setScannedItems(scannedItems.filter((item) => item.id !== productId));
    toast.success('Item removed');
  };

  // Submit stock in
  const submitStockIn = async () => {
    if (scannedItems.length === 0) {
      toast.error('Add at least one item');
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of scannedItems) {
        try {
          await stockService.recordStockIn({
            productId: item.id,
            barcode: item.barcode,
            productName: item.name,
            quantity: item.quantity,
            staffId: currentUser.uid,
            staffName: currentUser.email,
            storeName: 'Main Store', // TODO: Get from context or props
            reason: 'Stock received via barcode scan',
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to add stock for ${item.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Stock updated for ${successCount} product(s)`);
        setScannedItems([]);
      }

      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} product(s)`);
      }
    } catch (error) {
      toast.error('Failed to submit stock in: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Stock In
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Receive and add inventory using barcode scanning
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Scan Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Product Selection */}
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Select Product
              </h2>

              {/* Camera Scan Button */}
              <button
                onClick={() => setShowScanner(true)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition mb-4"
              >
                <Scan className="w-5 h-5" />
                Open Camera Scan
              </button>

              {/* OR Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-secondary-300 dark:border-secondary-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400">
                    OR
                  </span>
                </div>
              </div>

              {/* Manual Search */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Search by Barcode or SKU
                </label>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Enter barcode, SKU or product name..."
                  className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="max-h-48 overflow-y-auto border border-secondary-300 dark:border-secondary-600 rounded-lg divide-y divide-secondary-300 dark:divide-secondary-600">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="w-full text-left p-3 hover:bg-secondary-100 dark:hover:bg-secondary-700 transition flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium text-secondary-900 dark:text-white">
                            {product.name}
                          </p>
                          <p className="text-sm text-secondary-600 dark:text-secondary-400">
                            {product.barcode} • Stock: {product.quantity}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-primary-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Product Display */}
              {currentProduct && (
                <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-secondary-900 dark:text-white">
                        {currentProduct.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Barcode: {currentProduct.barcode}
                      </p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Current Stock: {currentProduct.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentProduct(null);
                        setCurrentBarcode('');
                        setCurrentQuantity('');
                      }}
                      className="p-2 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg transition"
                    >
                      <X className="w-5 h-5 text-primary-600" />
                    </button>
                  </div>

                  {/* Quantity Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Quantity to Add
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem();
                        }
                      }}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      autoFocus
                    />
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={addItem}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                  >
                    <Check className="w-5 h-5" />
                    Add to Stock In
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <div className="card sticky top-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Stock In Summary
              </h2>

              {scannedItems.length === 0 ? (
                <p className="text-secondary-600 dark:text-secondary-400 text-center py-8">
                  No items added yet
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6">
                    {scannedItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-secondary-900 dark:text-white text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-secondary-600 dark:text-secondary-400">
                              {item.barcode}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded text-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          +{item.quantity} units
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6 pt-6 border-t border-secondary-200 dark:border-secondary-600">
                    <div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Items
                      </p>
                      <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                        {scannedItems.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Total Units
                      </p>
                      <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                        {scannedItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={submitStockIn}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                  >
                    <Check className="w-5 h-5" />
                    {isLoading ? 'Processing...' : 'Complete Stock In'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScanBarcode}
          onClose={() => setShowScanner(false)}
          title="Scan Product Barcode"
        />
      )}

      {/* Create New Product Modal */}
      {showCreateProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
                Create New Product
              </h2>
              <button
                onClick={() => setShowCreateProductModal(false)}
                className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Barcode Display */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Barcode
                </label>
                <input
                  type="text"
                  value={currentBarcode}
                  disabled
                  className="w-full px-3 py-2 bg-secondary-100 dark:bg-secondary-700 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-900 dark:text-white"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProductForm.name}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, name: e.target.value })
                  }
                  placeholder="e.g., iPhone 15 Pro"
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white placeholder-secondary-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newProductForm.price}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, price: e.target.value })
                  }
                  placeholder="e.g., 99999"
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Category *
                </label>
                <select
                  value={newProductForm.category}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                >
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Food</option>
                  <option>Books</option>
                  <option>Others</option>
                </select>
              </div>

              {/* Initial Quantity */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Initial Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={newProductForm.quantity}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, quantity: e.target.value })
                  }
                  placeholder="e.g., 10"
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>

              {/* SKU (Optional) */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  value={newProductForm.sku}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, sku: e.target.value })
                  }
                  placeholder="e.g., SKU123"
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-secondary-200 dark:border-secondary-700">
              <button
                onClick={() => setShowCreateProductModal(false)}
                className="flex-1 px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProduct}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
              >
                <Check className="w-5 h-5" />
                {isLoading ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockInPage;
