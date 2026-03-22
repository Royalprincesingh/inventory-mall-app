export const calculateStats = {
  calculateRevenue(sales) {
    return sales.reduce((total, sale) => total + (sale.amount || 0), 0)
  },

  calculateProfit(revenue, cost) {
    return revenue - cost
  },

  calculateProfitMargin(profit, revenue) {
    return revenue > 0 ? ((profit / revenue) * 100).toFixed(2) : 0
  },

  getTopSellingProducts(sales) {
    const productMap = {}
    sales.forEach(sale => {
      sale.items?.forEach(item => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            quantity: 0,
            revenue: 0,
          }
        }
        productMap[item.productId].quantity += item.quantity || 0
        productMap[item.productId].revenue += item.total || 0
      })
    })
    return Object.values(productMap).sort((a, b) => b.revenue - a.revenue)
  },

  getSlowMovingProducts(products, threshold = 5) {
    return products.filter(p => (p.soldUnits || 0) < threshold).sort((a, b) => a.soldUnits - b.soldUnits)
  },

  calculateInventoryValue(products) {
    return products.reduce((total, product) => {
      return total + ((product.quantity || 0) * (product.costPrice || 0))
    }, 0)
  },

  calculateAverageInventoryTurnover(sales, inventoryValue) {
    const totalSalesValue = sales.reduce((total, sale) => total + (sale.amount || 0), 0)
    return inventoryValue > 0 ? totalSalesValue / inventoryValue : 0
  },
}

export const formatters = {
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  },

  formatDate(date) {
    if (!date) return '-'
    if (date.toDate) return date.toDate().toLocaleDateString()
    return new Date(date).toLocaleDateString()
  },

  formatDateTime(date) {
    if (!date) return '-'
    if (date.toDate) return date.toDate().toLocaleString()
    return new Date(date).toLocaleString()
  },

  formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number)
  },

  generateSKU() {
    return `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  },

  generateBarcode() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  },
}
