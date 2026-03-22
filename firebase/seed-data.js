// Firestore Seed Data Script
// Run this in Firebase Cloud Functions or use Firebase Admin SDK

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// const serviceAccount = require('./path/to/serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const db = admin.firestore();

// Sample data
const sampleCategories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Clothing', description: 'Apparel and fashion items' },
  { name: 'Food & Beverages', description: 'Food, drinks, and groceries' },
  { name: 'Home & Kitchen', description: 'Household items and kitchenware' },
  { name: 'Beauty & Personal Care', description: 'Cosmetics and personal care products' },
  { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
];

const sampleBrands = [
  { name: 'Tech Pro', country: 'USA', website: 'techpro.com' },
  { name: 'Fashion Plus', country: 'Italy', website: 'fashionplus.com' },
  { name: 'Fresh Foods', country: 'India', website: 'freshfoods.com' },
  { name: 'Home Comfort', country: 'Germany', website: 'homecomfort.com' },
  { name: 'Beauty World', country: 'France', website: 'beautyworld.com' },
];

const sampleSuppliers = [
  {
    name: 'Global Supplies Inc',
    contactPerson: 'Michael Chen',
    phone: '+1-800-123-4567',
    email: 'contact@globalsupplies.com',
    address: '123 Business Park, Tech Valley',
    city: 'San Francisco',
    country: 'USA',
    paymentTerms: 'Net 30',
    rating: 4.5,
    status: 'active',
  },
  {
    name: 'Asian Wholesalers Ltd',
    contactPerson: 'Rajesh Kumar',
    phone: '+91-22-1234-5678',
    email: 'sales@asianwholesalers.com',
    address: '456 Commerce Building, Trade Center',
    city: 'Mumbai',
    country: 'India',
    paymentTerms: 'Net 45',
    rating: 4.2,
    status: 'active',
  },
  {
    name: 'European Trade Co',
    contactPerson: 'Anna Schmidt',
    phone: '+49-30-1234-5678',
    email: 'info@europeantrade.de',
    address: '789 Industrial Zone',
    city: 'Berlin',
    country: 'Germany',
    paymentTerms: 'Net 60',
    rating: 4.8,
    status: 'active',
  },
];

const sampleStores = [
  {
    name: 'Electronics Store',
    location: 'Level 1, Block A',
    manager: 'John Mitchell',
    phone: '+1-555-0101',
    email: 'electronics@mall.com',
    openingTime: '10:00',
    closingTime: '21:00',
    address: '123 Shopping Mall, Main Street',
    area: 2500,
    status: 'active',
  },
  {
    name: 'Fashion Boutique',
    location: 'Level 2, Block B',
    manager: 'Sarah Johnson',
    phone: '+1-555-0102',
    email: 'fashion@mall.com',
    openingTime: '10:00',
    closingTime: '21:30',
    address: '123 Shopping Mall, Main Street',
    area: 3000,
    status: 'active',
  },
  {
    name: 'Food Court',
    location: 'Level 3, Central',
    manager: 'David Lee',
    phone: '+1-555-0103',
    email: 'food@mall.com',
    openingTime: '09:00',
    closingTime: '22:00',
    address: '123 Shopping Mall, Main Street',
    area: 4000,
    status: 'active',
  },
  {
    name: 'Home Decor',
    location: 'Level 1, Block C',
    manager: 'Emma Wilson',
    phone: '+1-555-0104',
    email: 'homedecor@mall.com',
    openingTime: '10:00',
    closingTime: '21:00',
    address: '123 Shopping Mall, Main Street',
    area: 2800,
    status: 'active',
  },
];

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    sku: 'SKU-WH-001',
    barcode: '123456789001',
    category: 'Electronics',
    brand: 'Tech Pro',
    description: 'Premium wireless headphones with noise cancellation',
    costPrice: 45,
    sellingPrice: 99.99,
    quantity: 50,
    minStock: 10,
    reorderPoint: 15,
    status: 'active',
  },
  {
    name: 'Designer T-Shirt',
    sku: 'SKU-TS-001',
    barcode: '123456789002',
    category: 'Clothing',
    brand: 'Fashion Plus',
    description: 'Comfortable designer t-shirt for all seasons',
    costPrice: 15,
    sellingPrice: 49.99,
    quantity: 120,
    minStock: 30,
    reorderPoint: 50,
    status: 'active',
  },
  {
    name: 'Organic Coffee Beans',
    sku: 'SKU-CB-001',
    barcode: '123456789003',
    category: 'Food & Beverages',
    brand: 'Fresh Foods',
    description: 'Premium organic coffee beans from around the world',
    costPrice: 8,
    sellingPrice: 24.99,
    quantity: 200,
    minStock: 50,
    reorderPoint: 80,
    status: 'active',
  },
  {
    name: 'Ceramic Dinner Set',
    sku: 'SKU-DS-001',
    barcode: '123456789004',
    category: 'Home & Kitchen',
    brand: 'Home Comfort',
    description: 'Beautiful 16-piece ceramic dinner set',
    costPrice: 35,
    sellingPrice: 89.99,
    quantity: 35,
    minStock: 8,
    reorderPoint: 15,
    status: 'active',
  },
  {
    name: 'Natural Face Cream',
    sku: 'SKU-FC-001',
    barcode: '123456789005',
    category: 'Beauty & Personal Care',
    brand: 'Beauty World',
    description: 'Organic face cream with natural ingredients',
    costPrice: 12,
    sellingPrice: 39.99,
    quantity: 85,
    minStock: 20,
    reorderPoint: 35,
    status: 'active',
  },
];

// Function to seed data
async function seedData() {
  try {
    console.log('Starting data seeding...');

    // Seed Categories
    console.log('Adding categories...');
    for (const category of sampleCategories) {
      await db.collection('categories').add({
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Seed Brands
    console.log('Adding brands...');
    for (const brand of sampleBrands) {
      await db.collection('brands').add({
        ...brand,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Seed Suppliers
    console.log('Adding suppliers...');
    for (const supplier of sampleSuppliers) {
      await db.collection('suppliers').add({
        ...supplier,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Seed Stores
    console.log('Adding stores...');
    for (const store of sampleStores) {
      await db.collection('stores').add({
        ...store,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Seed Products
    console.log('Adding products...');
    for (const product of sampleProducts) {
      await db.collection('products').add({
        ...product,
        storeId: 'store-001', // Replace with actual store ID
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        soldUnits: 0,
      });
    }

    console.log('✅ Data seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  }
}

// Run seeding
seedData();

module.exports = seedData;
