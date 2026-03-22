import {
  collection,
  doc,
  writeBatch,
  getDoc,
  addDoc,
  serverTimestamp,
  increment,
  runTransaction,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Service for stock transactions with Firestore consistency guarantees
 */
const stockService = {
  /**
   * Record stock increase (Stock In) with transaction
   * @param {Object} params
   * @param {string} params.productId - Product ID
   * @param {string} params.barcode - Product barcode
   * @param {string} params.productName - Product name
   * @param {number} params.quantity - Quantity to add
   * @param {string} params.staffId - Staff member ID
   * @param {string} params.staffName - Staff member name
   * @param {string} params.storeName - Store name
   * @param {string} params.reason - Reason for stock increase (optional)
   * @returns {Object} Updated product and log entry
   */
  async recordStockIn({
    productId,
    barcode,
    productName,
    quantity,
    staffId,
    staffName,
    storeName,
    reason = 'Stock received',
  }) {
    try {
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Use transaction for atomicity
      const result = await runTransaction(db, async (transaction) => {
        // Get current product data
        const productRef = doc(db, 'products', productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error('Product not found');
        }

        const currentQuantity = productDoc.data().quantity || productDoc.data().stock || 0;
        const newQuantity = currentQuantity + quantity;

        // Update product quantity
        transaction.update(productRef, {
          quantity: newQuantity,
          updatedAt: serverTimestamp(),
        });

        // Create inventory log
        const logsRef = collection(db, 'inventory_logs');
        const logDocRef = doc(logsRef);
        transaction.set(logDocRef, {
          productId,
          barcode,
          productName,
          type: 'stock_in',
          quantity,
          previousStock: currentQuantity,
          newStock: newQuantity,
          staffId,
          staffName,
          reason,
          storeName,
          timestamp: serverTimestamp(),
        });

        return {
          productId,
          productName,
          barcode,
          previousStock: currentQuantity,
          newStock: newQuantity,
          quantityAdded: quantity,
          logId: logDocRef.id,
        };
      });

      return result;
    } catch (error) {
      console.error('Error recording stock in:', error);
      throw error;
    }
  },

  /**
   * Record sale (Stock Out) with transaction
   * @param {Object} params
   * @param {string} params.productId - Product ID
   * @param {string} params.barcode - Product barcode
   * @param {string} params.productName - Product name
   * @param {number} params.quantity - Quantity sold
   * @param {number} params.unitPrice - Unit price
   * @param {string} params.staffId - Staff member ID
   * @param {string} params.staffName - Staff member name
   * @param {string} params.storeName - Store name
   * @returns {Object} Updated product, log entry, and sale record
   */
  async recordSale({
    productId,
    barcode,
    productName,
    quantity,
    unitPrice,
    staffId,
    staffName,
    storeName,
  }) {
    try {
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      // Use transaction for atomicity
      const result = await runTransaction(db, async (transaction) => {
        // Get current product data
        const productRef = doc(db, 'products', productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error('Product not found');
        }

        const currentQuantity = productDoc.data().quantity || productDoc.data().stock || 0;

        // Check if stock is sufficient
        if (currentQuantity < quantity) {
          throw new Error(
            `Insufficient stock. Available: ${currentQuantity}, Required: ${quantity}`
          );
        }

        const newQuantity = currentQuantity - quantity;
        const totalPrice = quantity * unitPrice;

        // Update product quantity
        transaction.update(productRef, {
          quantity: newQuantity,
          updatedAt: serverTimestamp(),
        });

        // Create sale record
        const salesRef = collection(db, 'sales');
        const saleDocRef = doc(salesRef);
        transaction.set(saleDocRef, {
          productId,
          barcode,
          productName,
          quantity,
          unitPrice,
          totalPrice,
          staffId,
          staffName,
          storeName,
          saleDate: serverTimestamp(),
          createdAt: serverTimestamp(),
        });

        // Create inventory log
        const logsRef = collection(db, 'inventory_logs');
        const logDocRef = doc(logsRef);
        transaction.set(logDocRef, {
          productId,
          barcode,
          productName,
          type: 'sale',
          quantity: -quantity, // Negative for outflow
          previousStock: currentQuantity,
          newStock: newQuantity,
          staffId,
          staffName,
          reason: 'Sale transaction',
          storeName,
          timestamp: serverTimestamp(),
        });

        return {
          saleId: saleDocRef.id,
          logId: logDocRef.id,
          productId,
          productName,
          barcode,
          quantity,
          totalPrice,
          previousStock: currentQuantity,
          newStock: newQuantity,
        };
      });

      return result;
    } catch (error) {
      console.error('Error recording sale:', error);
      throw error;
    }
  },

  /**
   * Record stock adjustment with transaction
   * @param {Object} params
   * @param {string} params.productId - Product ID
   * @param {string} params.barcode - Product barcode
   * @param {string} params.productName - Product name
   * @param {number} params.quantityChange - Quantity change (positive or negative)
   * @param {string} params.staffId - Staff member ID
   * @param {string} params.staffName - Staff member name
   * @param {string} params.storeName - Store name
   * @param {string} params.reason - Reason for adjustment
   * @returns {Object} Updated product and log entry
   */
  async recordAdjustment({
    productId,
    barcode,
    productName,
    quantityChange,
    staffId,
    staffName,
    storeName,
    reason = 'Stock adjustment',
  }) {
    try {
      if (quantityChange === 0) {
        throw new Error('Quantity change must not be zero');
      }

      // Use transaction for atomicity
      const result = await runTransaction(db, async (transaction) => {
        // Get current product data
        const productRef = doc(db, 'products', productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error('Product not found');
        }

        const currentQuantity = productDoc.data().quantity || productDoc.data().stock || 0;
        const newQuantity = currentQuantity + quantityChange;

        if (newQuantity < 0) {
          throw new Error(`Stock cannot be negative. Current: ${currentQuantity}`);
        }

        // Update product quantity
        transaction.update(productRef, {
          quantity: newQuantity,
          updatedAt: serverTimestamp(),
        });

        // Create inventory log
        const logsRef = collection(db, 'inventory_logs');
        const logDocRef = doc(logsRef);
        transaction.set(logDocRef, {
          productId,
          barcode,
          productName,
          type: 'adjustment',
          quantity: quantityChange,
          previousStock: currentQuantity,
          newStock: newQuantity,
          staffId,
          staffName,
          reason,
          storeName,
          timestamp: serverTimestamp(),
        });

        return {
          productId,
          productName,
          barcode,
          previousStock: currentQuantity,
          newStock: newQuantity,
          quantityChange,
          logId: logDocRef.id,
        };
      });

      return result;
    } catch (error) {
      console.error('Error recording adjustment:', error);
      throw error;
    }
  },

  /**
   * Get stock movement history for a product
   */
  async getProductStockHistory(productId, limit = 50) {
    try {
      const logsRef = collection(db, 'inventory_logs');
      const q = query(
        logsRef,
        where('productId', '==', productId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting stock history:', error);
      throw error;
    }
  },
};

export default stockService;
