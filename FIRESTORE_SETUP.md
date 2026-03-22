# Firestore Setup Guide

## Step 1: Create Firestore Database

1. Go to: https://console.firebase.google.com/project/marketdekho-90910973-9ec12
2. Click **Build** (left sidebar)
3. Select **Firestore Database**
4. Click **Create database**
5. Choose: **Production mode**
6. Select region: **asia-south1** (India - closest to you)
7. Click **Create**

Wait 2-3 minutes for database to initialize...

---

## Step 2: Add Sample Collections & Data

### Collection 1: products

1. In Firestore Console, click **Start collection**
2. Name: `products`
3. Add first document:
   - Document ID: auto (click)
   - Add fields:
     ```
     name: "Wireless Headphones" (string)
     sku: "SKU-001" (string)
     barcode: "BAR-001" (string)
     category: "Electronics" (string)
     brand: "TechPro" (string)
     quantity: 45 (number)
     minStock: 10 (number)
     costPrice: 2000 (number)
     sellingPrice: 4500 (number)
     description: "High quality wireless headphones" (string)
     soldUnits: 120 (number)
     status: "in_stock" (string)
     ```
   - Click **Save**

4. Repeat steps 2-3 for other products (see sample-data.json)

### Collection 2: stores

1. Click **Start collection**
2. Name: `stores`
3. Add documents with data from sample-data.json

### Collection 3: categories

1. Click **Start collection**
2. Name: `categories`
3. Add documents with data from sample-data.json

### Collection 4: suppliers

1. Click **Start collection**
2. Name: `suppliers`
3. Add documents with data from sample-data.json

### More Collections (Create Empty)

Just create these collections without data for now:
- `orders` (empty)
- `sales` (empty)
- `logs` (empty)

Steps:
1. Click **Start collection**
2. Enter name (e.g., `orders`)
3. Click **Create a document**
4. Add any field (e.g., `createdAt`: current timestamp)
5. Click **Save**

---

## Step 3: Update Security Rules

1. Go to Firestore → **Rules** tab
2. Replace all code with this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

---

## Step 4: Create Users in Firebase Auth

1. Go to **Authentication** (left sidebar)
2. Click **Add user**
3. Add three demo users:

**User 1:**
- Email: admin@mall.com
- Password: admin123

**User 2:**
- Email: manager@store.com
- Password: manager123

**User 3:**
- Email: staff@store.com
- Password: staff123

---

## Done! 🎉

Now go to: https://marketdekho-90910973-9ec12.web.app

- Login with: `admin@mall.com` / `admin123`
- Dashboard will load with REAL Firestore data!

---

## Troubleshooting

**Dashboard still blank?**
- Check browser console (F12 → Console) for errors
- Firestore rules might be blocking access - update them above

**Missing data?**
- Make sure collections exist: `products`, `stores`, `categories`, `suppliers`
- At least one document per collection is needed

**Auth error?**
- Create users in Firebase Console → Authentication
- Use exact email/password from above
