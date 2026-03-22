import React, { useState, useRef } from 'react';
import { Scan, Plus, X, Check, AlertTriangle, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import BarcodeScanner from '../components/BarcodeScanner';
import barcodeService from '../services/barcodeService';
import stockService from '../services/stockService';
import { useAuth } from '../context/AuthContext';

const SalesScanPage = () => {
  const { currentUser } = useAuth();
  
  // Prevent duplicate scans
  const isProcessingRef = useRef(false);
  const lastScannedRef = useRef(null);
  
  const [showScanner, setShowScanner] = useState(false);
  const [cartItems, setCartItems] = useState([]);
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
    quantity: '1',
    sku: '',
  });

  // Handle barcode scan - clean implementation
  const handleScanBarcode = async (barcode) => {
    // Prevent duplicate processing
    if (isProcessingRef.current) {
      console.warn('⏸️ Scan already in progress');
      return;
    }

    isProcessingRef.current = true;
    lastScannedRef.current = barcode;

    try {
      setShowScanner(false);
      setCurrentBarcode(barcode);
      setIsLoading(true);

      console.log('🔍 Searching for product with barcode:', barcode);

      // Search product in Firestore
      const product = await barcodeService.findProductByBarcode(barcode);

      console.log('✅ Product found:', product.name);

      // Check stock
      if (product.quantity <= 0) {
        toast.error(`❌ ${product.name} is out of stock`, { icon: '📦' });
        setCurrentProduct(null);
        return;
      }

      setCurrentProduct(product);
      setCurrentQuantity('1');
      toast.success(`✅ ${product.name} - ₹${product.sellingPrice}`, { icon: '📦' });
      
    } catch (error) {
      // Product not found
      console.error('❌ Product not found:', error.message);
      
      setCurrentProduct(null);
      setCurrentBarcode(barcode);
      
      // Show warning and prompt to create
      toast.error('Product not found! Opening creation form...', {
        duration: 3000,
        icon: '🔍',
      });
      
      // Open add product modal
      setShowCreateProductModal(true);
      
    } finally {
      setIsLoading(false);
      
      // Unlock after delay
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 800);
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
      // Filter products with stock available
      const inStock = results.filter((p) => p.quantity > 0);
      setSearchResults(inStock);
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
      setCurrentQuantity('1');
    } catch (error) {
      toast.error('Failed to create product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async () => {
    if (!currentProduct) {
      toast.error('Please select a product');
      return;
    }

    const quantity = parseInt(currentQuantity);
    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (quantity > currentProduct.quantity) {
      toast.error(
        `Only ${currentProduct.quantity} units available. Stock insufficient!`
      );
      return;
    }

    // Check if product already in cart
    const existingItem = cartItems.find(
      (item) => item.id === currentProduct.id
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > currentProduct.quantity) {
        toast.error(
          `Total quantity exceeds available stock (${currentProduct.quantity})`
        );
        return;
      }

      // Update quantity
      setCartItems(
        cartItems.map((item) =>
          item.id === currentProduct.id
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      toast.success('Quantity updated');
    } else {
      // Add new item
      setCartItems([
        ...cartItems,
        {
          ...currentProduct,
          quantity, // This is current added quantity
          stock: currentProduct.quantity, // Preserve stock level for limits
          addedAt: new Date(),
        },
      ]);
      toast.success(`${currentProduct.name} added to cart`);
    }

    // Reset form
    setCurrentBarcode('');
    setCurrentQuantity('');
    setCurrentProduct(null);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
    toast.success('Item removed from cart');
  };

  // Update item quantity in cart
  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const product = cartItems.find((item) => item.id === productId);
    if (newQuantity > product.quantity) {
      toast.error(
        `Only ${product.quantity} units available`
      );
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    if (window.confirm('Clear all items from cart?')) {
      setCartItems([]);
      toast.success('Cart cleared');
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let items = 0;
    let units = 0;

    cartItems.forEach((item) => {
      const itemTotal = item.quantity * item.sellingPrice;
      subtotal += itemTotal;
      items++;
      units += item.quantity;
    });

    const tax = subtotal * 0.05; // 5% tax
    const total = subtotal + tax;

    return { subtotal, tax, total, items, units };
  };

  // Submit sale
  const submitSale = async () => {
    if (cartItems.length === 0) {
      toast.error('Add at least one item');
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const item of cartItems) {
        try {
          await stockService.recordSale({
            productId: item.id,
            barcode: item.barcode,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.sellingPrice,
            staffId: currentUser.uid,
            staffName: currentUser.email,
            storeName: 'Main Store', // TODO: Get from context or props
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to process sale for ${item.name}:`, error);
          errorCount++;
          toast.error(`Failed to sell ${item.name}: ${error.message}`);
        }
      }

      if (successCount > 0) {
        const { total } = calculateTotals();
        toast.success(`Sale completed! ${successCount} product(s) sold. Total: ₹${total.toFixed(2)}`);
        setCartItems([]);
      }

      if (errorCount > 0) {
        toast.error(`${errorCount} product(s) failed to process`);
      }
    } catch (error) {
      toast.error('Failed to submit sale: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 p-4 md:p-6">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Sales Scan
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Scan products and complete sales transactions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Add Products
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
                            {product.barcode} • ₹{product.sellingPrice} • Stock: {product.quantity}
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
                      <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">
                        Price: ₹{currentProduct.sellingPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Available Stock: {currentProduct.quantity}
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
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={currentProduct.quantity}
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToCart();
                        }
                      }}
                      placeholder="Enter quantity"
                      className="w-full px-4 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg bg-white dark:bg-secondary-700 text-secondary-900 dark:text-white"
                      autoFocus
                    />
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={addToCart}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                  >
                    <Plus className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>
              )}
            </div>

            {/* Cart Items */}
            {cartItems.length > 0 && (
              <div className="card">
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                  Shopping Cart ({cartItems.length} items)
                </h2>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-secondary-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          ₹{item.sellingPrice.toFixed(2)} × {item.quantity} = ₹
                          {(item.sellingPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-sm bg-secondary-200 dark:bg-secondary-600 rounded hover:bg-secondary-300 dark:hover:bg-secondary-500"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-secondary-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="px-2 py-1 text-sm bg-secondary-200 dark:bg-secondary-600 rounded hover:bg-secondary-300 dark:hover:bg-secondary-500 disabled:opacity-50"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-2 p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Summary */}
          <div className="space-y-6">
            <div className="card sticky top-6">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
                Sale Summary
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-secondary-600 dark:text-secondary-400 text-center py-8">
                  Cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 pb-6 border-b border-secondary-200 dark:border-secondary-600">
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">
                        Items
                      </span>
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        {totals.items}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">
                        Units
                      </span>
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        {totals.units}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">
                        Subtotal
                      </span>
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        ₹{totals.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600 dark:text-secondary-400">
                        Tax (5%)
                      </span>
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        ₹{totals.tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-secondary-900 dark:text-white">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        ₹{totals.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={submitSale}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition"
                    >
                      <Check className="w-5 h-5" />
                      {isLoading ? 'Processing...' : 'Complete Sale'}
                    </button>
                    <button
                      onClick={clearCart}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary-200 dark:bg-secondary-700 hover:bg-secondary-300 dark:hover:bg-secondary-600 disabled:opacity-50 rounded-lg font-medium transition"
                    >
                      <X className="w-5 h-5" />
                      Clear Cart
                    </button>
                  </div>
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
                  Initial Stock Quantity
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

export default SalesScanPage;
