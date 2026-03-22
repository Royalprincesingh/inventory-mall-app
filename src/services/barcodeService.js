import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  writeBatch,
  addDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Service for barcode scanning and product lookups
 */
const barcodeService = {
  /**
   * Find product by barcode - simplified version
   */
  async findProductByBarcode(barcode) {
    try {
      if (!barcode || barcode.trim() === '') {
        throw new Error('Barcode cannot be empty');
      }

      const cleanBarcode = barcode.trim();
      console.log('🔍 Searching for barcode:', cleanBarcode);

      // Query products collection by barcode field
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('barcode', '==', cleanBarcode));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const product = {
          id: doc.id,
          ...doc.data(),
        };
        // Normalize fields
        product.quantity = product.quantity ?? product.stock ?? 0;
        product.sellingPrice = product.sellingPrice ?? product.price ?? 0;
        
        console.log('✅ Product found:', product.name);
        return product;
      }

      // Try case-insensitive search (fallback)
      console.log('⚠️ Exact match not found, trying case-insensitive...');
      const allProductsQuery = query(productsRef, where('status', '==', 'active'));
      const allProducts = await getDocs(allProductsQuery);
      
      const similar = allProducts.docs
        .map(doc => {
          const data = doc.data();
          return { 
            id: doc.id, 
            ...data,
            quantity: data.quantity ?? data.stock ?? 0,
            sellingPrice: data.sellingPrice ?? data.price ?? 0
          };
        })
        .filter(product => {
          const pBarcode = (product.barcode || '').toString().toLowerCase();
          const searchBarcode = cleanBarcode.toLowerCase();
          return pBarcode === searchBarcode;
        });

      if (similar.length > 0) {
        console.log('✅ Product found (case-insensitive):', similar[0].name);
        return similar[0];
      }

      // Not found
      throw new Error(`Product with barcode "${cleanBarcode}" not found`);
    } catch (error) {
      console.error('❌ Error finding product:', error.message);
      throw error;
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    try {
      const docRef = doc(db, 'products', productId);
      const docSnapshot = await getDoc(docRef);

      if (!docSnapshot.exists()) {
        throw new Error('Product not found');
      }

      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  },

  /**
   * Search products by barcode or SKU (partial match)
   */
  async searchProducts(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        return [];
      }

      const productsRef = collection(db, 'products');
      // Fetch all products and filter locally for text matches
      const querySnapshot = await getDocs(productsRef);

      const results = querySnapshot.docs
        .filter((doc) => {
          const data = doc.data();
          const searchLower = searchTerm.toLowerCase();
          return (
            data.barcode?.toLowerCase().includes(searchLower) ||
            data.sku?.toLowerCase().includes(searchLower) ||
            data.name?.toLowerCase().includes(searchLower)
          );
        })
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            quantity: data.quantity ?? data.stock ?? 0,
            sellingPrice: data.sellingPrice ?? data.price ?? 0
          };
        });

      return results;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  /**
   * Get all products with low stock
   */
  async getLowStockProducts(threshold = 10) {
    try {
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef,
        where('quantity', '<', threshold)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          quantity: data.quantity ?? data.stock ?? 0,
          sellingPrice: data.sellingPrice ?? data.price ?? 0
        };
      });
    } catch (error) {
      console.error('Error getting low stock products:', error);
      throw error;
    }
  },

  /**
   * Create a new product with barcode
   */
  async createProductWithBarcode(productData) {
    try {
      const { barcode, name, price, category, quantity, sku } = productData;

      // Validate required fields
      if (!barcode || !name || !price || !category) {
        throw new Error('Barcode, name, price, and category are required');
      }

      // Check if barcode already exists
      const productsRef = collection(db, 'products');
      const q = query(productsRef, where('barcode', '==', barcode.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error(`Product with barcode "${barcode}" already exists`);
      }

      // Create new product document
      const newProduct = {
        barcode: barcode.trim(),
        name: name.trim(),
        sellingPrice: parseFloat(price),
        costPrice: parseFloat(price) * 0.7, // Default estimate if not provided
        category: category.trim(),
        quantity: parseInt(quantity) || 0,
        sku: sku?.trim() || '',
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add product to Firestore
      const docRef = await addDoc(productsRef, newProduct);

      return {
        id: docRef.id,
        ...newProduct,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
};

export default barcodeService;
