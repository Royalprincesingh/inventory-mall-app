// Firebase Cloud Functions for backend operations
// Deploy with: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

// ==================== LOW STOCK ALERTS ====================
exports.checkLowStockAlerts = functions.pubsub.schedule('every 1 hours').onRun(async (context) => {
  try {
    const productsSnapshot = await db.collection('products').where('quantity', '<', 'minStock').get();
    
    const alerts = [];
    productsSnapshot.forEach(doc => {
      const product = doc.data();
      alerts.push({
        type: 'low_stock',
        title: `Low Stock Alert: ${product.name}`,
        message: `${product.name} stock is below minimum level. Current: ${product.quantity}, Min: ${product.minStock}`,
        productId: doc.id,
        quantity: product.quantity,
        minStock: product.minStock,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    if (alerts.length > 0) {
      const batch = db.batch();
      alerts.forEach(alert => {
        batch.set(db.collection('notifications').doc(), alert);
      });
      await batch.commit();
    }

    console.log(`Created ${alerts.length} low stock alerts`);
    return null;
  } catch (error) {
    console.error('Error checking low stock:', error);
    throw error;
  }
});

// ==================== AUTO REORDER POINTS ====================
exports.generateAutoReorders = functions.pubsub.schedule('every 6 hours').onRun(async (context) => {
  try {
    const productsSnapshot = await db.collection('products')
      .where('quantity', '<=', 'reorderPoint').get();
    
    const orders = [];
    productsSnapshot.forEach(doc => {
      const product = doc.data();
      orders.push({
        supplierId: product.supplier,
        items: [{
          productId: doc.id,
          productName: product.name,
          quantity: product.minStock * 2, // Reorder for double min stock
          unitPrice: product.costPrice,
        }],
        totalAmount: (product.minStock * 2) * product.costPrice,
        status: 'auto_generated',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    if (orders.length > 0) {
      const batch = db.batch();
      orders.forEach(order => {
        batch.set(db.collection('purchase_orders').doc(), order);
      });
      await batch.commit();
    }

    console.log(`Generated ${orders.length} auto-reorder purchase orders`);
    return null;
  } catch (error) {
    console.error('Error generating reorders:', error);
    throw error;
  }
});

// ==================== DAILY SALES SUMMARY ====================
exports.generateDailySalesSummary = functions.pubsub.schedule('every day 23:59').timeZone('UTC').onRun(async (context) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const salesSnapshot = await db.collection('sales')
      .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(today))
      .where('createdAt', '<', admin.firestore.Timestamp.fromDate(tomorrow))
      .get();

    let totalRevenue = 0;
    let totalQuantity = 0;
    let transactionCount = 0;

    salesSnapshot.forEach(doc => {
      const sale = doc.data();
      totalRevenue += sale.amount || 0;
      totalQuantity += sale.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
      transactionCount += 1;
    });

    const summary = {
      date: today,
      totalRevenue,
      totalQuantity,
      transactionCount,
      averageTransaction: transactionCount > 0 ? totalRevenue / transactionCount : 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('daily_sales_summary').doc(today.toISOString().split('T')[0]).set(summary);
    console.log('Daily sales summary created');
    return null;
  } catch (error) {
    console.error('Error generating daily summary:', error);
    throw error;
  }
});

// ==================== UPDATE INVENTORY ON SALE ====================
exports.updateInventoryOnSale = functions.firestore.document('sales/{saleId}').onCreate(async (snap, context) => {
  try {
    const sale = snap.data();
    const batch = db.batch();

    if (sale.items && Array.isArray(sale.items)) {
      for (const item of sale.items) {
        const productRef = db.collection('products').doc(item.productId);
        batch.update(productRef, {
          quantity: admin.firestore.FieldValue.increment(-item.quantity),
          soldUnits: admin.firestore.FieldValue.increment(item.quantity),
        });
      }
    }

    await batch.commit();
    console.log('Inventory updated for sale', context.params.saleId);
    return null;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
});

// ==================== AUDIT LOGGING ====================
exports.logAllChanges = functions.firestore.document('{collection}/{document}').onCreate(async (snap, context) => {
  try {
    const doc = snap.data();
    
    // Skip logging for logs collection itself
    if (context.params.collection === 'activity_logs') return null;

    await db.collection('activity_logs').add({
      action: 'CREATE',
      affectedDocumentType: context.params.collection,
      affectedDocumentId: context.params.document,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      details: JSON.stringify(doc),
    });

    return null;
  } catch (error) {
    console.error('Error logging change:', error);
  }
});

// ==================== SEND EMAIL NOTIFICATION ====================
exports.sendLowStockEmail = functions.firestore.document('notifications/{notificationId}').onCreate(async (snap, context) => {
  try {
    const notification = snap.data();
    
    if (notification.type === 'low_stock') {
      // Integrate with Sendgrid or your email service
      console.log('Send email notification:', notification.message);
      // TODO: Implement actual email sending
    }

    return null;
  } catch (error) {
    console.error('Error sending email:', error);
  }
});
