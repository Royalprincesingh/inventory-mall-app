import { useState } from 'react'
import toast from 'react-hot-toast'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import store from './redux/store'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { AdminDashboard } from './pages/AdminDashboard'
import { ManagerDashboard } from './pages/ManagerDashboard'
import { StaffDashboard } from './pages/StaffDashboard'
import { LoginPage } from './pages/LoginPage'
import { ProductsPage } from './pages/ProductsPage'
import { StoresPage } from './pages/StoresPage'
import { SuppliersPage } from './pages/SuppliersPage'
import { OrdersPage } from './pages/OrdersPage'
import { SalesPage } from './pages/SalesPage'
import { ReportsPage } from './pages/ReportsPage'
import { ActivityLogsPage } from './pages/ActivityLogsPage'
import ScanProductPage from './pages/ScanProductPage'
import StockInPage from './pages/StockInPage'
import SalesScanPage from './pages/SalesScanPage'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser, loading, userRole, error } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Authentication Error</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  if (!userRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Role Not Assigned</h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-4">Your user account doesn't have a role assigned. Please contact the administrator.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return children
}

// Role-Based Dashboard Router
function RoleBasedDashboard() {
  const { userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  switch (userRole) {
    case 'admin':
      return (
        <MainLayout>
          <AdminDashboard />
        </MainLayout>
      )
    case 'manager':
      return (
        <MainLayout>
          <ManagerDashboard />
        </MainLayout>
      )
    case 'staff':
      return (
        <MainLayout>
          <StaffDashboard />
        </MainLayout>
      )
    default:
      return (
        <MainLayout>
          <Dashboard />
        </MainLayout>
      )
  }
}

// Main Layout Component
function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex bg-secondary-50 dark:bg-secondary-900 min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 md:ml-0">
        {children}
      </main>
    </div>
  )
}

function AppRoutes() {
  const { currentUser } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />} />

      {/* Role-Based Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin-only dashboard */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AdminDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Manager-only dashboard */}
      <Route
        path="/manager-dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ManagerDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Staff-only dashboard */}
      <Route
        path="/staff-dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StaffDashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProductsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StoresPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/suppliers"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SuppliersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OrdersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ActivityLogsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Barcode Scanning Routes */}
      <Route
        path="/scan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ScanProductPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stock-in"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StockInPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales-scan"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalesScanPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <AppRoutes />
            <Toaster position="top-right" />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  )
}
