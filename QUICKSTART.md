# Quick Start Guide

Get the Inventory Management System running in 10 minutes!

## Prerequisites
- Node.js 16+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Git
- A Firebase account ([Create free](https://firebase.google.com))

## Step 1: Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add project"** and name it (e.g., "inventory-mall")
3. Click **Create project** (wait for completion)
4. Click **Web icon** (</>) to add a web app
5. Name your app and click **Register app**
6. Copy the configuration shown - you'll need it next

## Step 2: Configure Firebase (3 minutes)

1. In the project root, copy the environment template:
```bash
cp .env.example .env.local
```

2. Open `.env.local` and paste your Firebase config:
```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

3. In Firebase Console, go to **Firestore Database** → **Create Database**
   - Select "Start in production mode"
   - Choose your region (closest to you)
   - Click **Create**

4. In Firebase Console, go to **Authentication** → **Sign-in method**
   - Enable **Email/Password**
   - Click **Save**

## Step 3: Install & Run (5 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Application is now running at `http://localhost:5173`

## Step 4: Create Demo User

In Firebase Console:

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Create first user:
   - Email: `admin@mall.com`
   - Password: `admin123` (change this in production!)
4. Click **Create user**

Repeat for other demo users:
- `manager@store.com` / `manager123`
- `staff@store.com` / `staff123`

## Step 5: Login

In your browser:
1. Go to `http://localhost:5173`
2. Login with: `admin@mall.com` / `admin123`
3. You should see the dashboard!

## 🎉 You're All Set!

### Next Steps

1. **Explore the app**
   - Navigate through different pages
   - Add products, stores, suppliers
   - Record sales
   - Generate reports

2. **Read documentation**
   - [README.md](./README.md) - Full feature overview
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy to production
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
   - [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

3. **Add real data**
   - Create your stores
   - Add product categories
   - Register suppliers
   - Import products

## Common Issues & Solutions

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
```

### Firebase credentials not working
- ✓ Check `.env.local` has correct values
- ✓ Verify all services are enabled in Firebase
- ✓ Make sure Firebase project allows your domain

### "Permission denied" errors
- ✓ Go to Firestore → Rules
- ✓ Use production mode rules from `firebase/firestore.rules`
- ✓ Deploy with: `firebase deploy --only firestore:rules`

### Port 5173 already in use
```bash
npm run dev -- --port 3000
```

## Demo Features to Try

1. **Dashboard**
   - View real-time stats
   - See sales trends
   - Check low stock alerts

2. **Products**
   - Add new product
   - Edit existing product
   - Search by name or SKU
   - Export product list

3. **Stores**
   - Add mall store
   - View store details
   - Edit store information

4. **Orders**
   - Create purchase order
   - Track order status
   - View supplier orders

5. **Sales**
   - Record daily sales
   - Track payment methods
   - View sales history

6. **Reports**
   - Generate daily/weekly/monthly reports
   - View top selling products
   - Export reports

7. **Dark Mode**
   - Toggle light/dark theme
   - Preference saved automatically

## Project Structure Preview

```
inventory-mall-app/
├── src/
│   ├── pages/          ← Main page components
│   ├── components/     ← Reusable components
│   ├── services/       ← Firebase operations
│   ├── context/        ← Auth & Theme
│   ├── redux/          ← State management
│   └── utils/          ← Helper functions
├── firebase/           ← Backend configs
├── public/             ← Static assets
├── README.md           ← Full documentation
└── DEPLOYMENT.md       ← Deploy to Firebase
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment (When Ready)

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy --project your-project-id
```

Your app will be live at: `https://your-project-id.web.app`

## Need Help?

📚 **Documentation**: Read [README.md](./README.md)  
🏗️ **Architecture**: Check [ARCHITECTURE.md](./ARCHITECTURE.md)  
📖 **API Docs**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)  
🚀 **Deployment**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)

## Security Reminders

⚠️ **Important for Production**:
1. Change admin passwords
2. Set up strong Firestore rules
3. Enable HTTPS (automatic on Firebase)
4. Enable 2FA for Firebase Console access
5. Set up backups
6. Review security rules regularly

## What's Included?

✅ Complete React application  
✅ Firebase backend setup  
✅ Tailwind CSS styling  
✅ Dark/Light mode  
✅ User authentication  
✅ Role-based access control  
✅ Real-time database  
✅ Cloud Functions ready  
✅ Responsive design  
✅ Error handling  
✅ Complete documentation  

## Performance Tips

- 📱 Mobile-first design works great
- 🌙 Dark mode reduces eye strain
- ⚡ Real-time updates via Firestore
- 📦 Optimized bundle size
- 🔐 Secure by default

---

**Ready to build awesome inventory management? Let's go! 🚀**

**Questions?** Check the docs or raise an issue.
