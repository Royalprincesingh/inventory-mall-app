import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Service for inventory log operations
 */
const inventoryLogService = {
  /**
   * Get recent inventory logs
   */
  async getRecentLogs(storeName = null, limitCount = 50) {
    try {
      const logsRef = collection(db, 'inventory_logs');
      
      // Simple query without storeName filter to avoid requiring composite index initially
      const q = query(
        logsRef,
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      let results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter by storeName in memory if provided
      if (storeName) {
        results = results.filter(log => log.storeName === storeName);
      }

      return results;
    } catch (error) {
      console.error('Error getting recent logs:', error);
      // Return empty array instead of throwing
      return [];
    }
  },

  /**
   * Get logs by type (stock_in, sale, adjustment)
   */
  async getLogsByType(type, storeName = null, limitCount = 50) {
    try {
      const logsRef = collection(db, 'inventory_logs');
      let q;

      if (storeName) {
        q = query(
          logsRef,
          where('type', '==', type),
          where('storeName', '==', storeName),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      } else {
        q = query(
          logsRef,
          where('type', '==', type),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting logs by type:', error);
      throw error;
    }
  },

  /**
   * Get logs for a specific product
   */
  async getProductLogs(productId, limitCount = 100) {
    try {
      const logsRef = collection(db, 'inventory_logs');
      const q = query(
        logsRef,
        where('productId', '==', productId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting product logs:', error);
      throw error;
    }
  },

  /**
   * Get logs by staff member
   */
  async getStaffLogs(staffId, limitCount = 50) {
    try {
      const logsRef = collection(db, 'inventory_logs');
      const q = query(
        logsRef,
        where('staffId', '==', staffId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting staff logs:', error);
      throw error;
    }
  },

  /**
   * Get logs within a date range
   */
  async getLogsByDateRange(startDate, endDate, storeName = null) {
    try {
      const logsRef = collection(db, 'inventory_logs');
      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      let q;
      if (storeName) {
        q = query(
          logsRef,
          where('storeName', '==', storeName),
          where('timestamp', '>=', startTimestamp),
          where('timestamp', '<=', endTimestamp),
          orderBy('timestamp', 'desc')
        );
      } else {
        q = query(
          logsRef,
          where('timestamp', '>=', startTimestamp),
          where('timestamp', '<=', endTimestamp),
          orderBy('timestamp', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting logs by date range:', error);
      throw error;
    }
  },

  /**
   * Get inventory summary
   */
  async getInventorySummary(storeName) {
    try {
      const logsRef = collection(db, 'inventory_logs');

      // Simple query without storeName filter to avoid composite index
      const q = query(
        logsRef,
        orderBy('timestamp', 'desc')
      );

      const snapshot = await getDocs(q);
      let logs = snapshot.docs.map((doc) => doc.data());

      // Filter by storeName in memory if provided
      if (storeName) {
        logs = logs.filter(log => log.storeName === storeName);
      }

      // Calculate totals by type
      const summary = {
        totalStockIn: 0,
        totalSales: 0,
        totalAdjustments: 0,
        totalTransactions: logs.length,
      };

      logs.forEach((log) => {
        if (log.type === 'stock_in') {
          summary.totalStockIn += log.quantity || 0;
        } else if (log.type === 'sale') {
          summary.totalSales += Math.abs(log.quantity || 0);
        } else if (log.type === 'adjustment') {
          summary.totalAdjustments += log.quantity || 0;
        }
      });

      return summary;
    } catch (error) {
      console.error('Error getting inventory summary:', error);
      // Return default summary instead of throwing
      return {
        totalStockIn: 0,
        totalSales: 0,
        totalAdjustments: 0,
        totalTransactions: 0,
      };
    }
  },

  /**
   * Format log for display
   */
  formatLogForDisplay(log) {
    const typeLabel = {
      stock_in: 'Stock Received',
      sale: 'Sale',
      adjustment: 'Adjustment',
    };

    return {
      ...log,
      typeLabel: typeLabel[log.type] || log.type,
      quantityDisplay: log.quantity > 0 ? `+${log.quantity}` : `${log.quantity}`,
      colorClass: {
        stock_in: 'text-green-600 dark:text-green-400',
        sale: 'text-red-600 dark:text-red-400',
        adjustment: 'text-blue-600 dark:text-blue-400',
      }[log.type] || 'text-gray-600',
      bgColorClass: {
        stock_in: 'bg-green-50 dark:bg-green-900/20',
        sale: 'bg-red-50 dark:bg-red-900/20',
        adjustment: 'bg-blue-50 dark:bg-blue-900/20',
      }[log.type] || 'bg-gray-50',
    };
  },
};

export default inventoryLogService;
