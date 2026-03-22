import { useState } from 'react'
import { Menu, X, LogOut, Settings, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export function Sidebar({ isOpen, setIsOpen }) {
  const { logout, currentUser } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { separator: true, label: 'Scanning' },
    { icon: '🔍', label: 'Barcode Scan', path: '/scan' },
    { icon: '📦', label: 'Stock In', path: '/stock-in' },
    { icon: '🛒', label: 'Sales Scan', path: '/sales-scan' },
    { separator: true, label: 'Management' },
    { icon: '📦', label: 'Products', path: '/products' },
    { icon: '🏪', label: 'Stores', path: '/stores' },
    { icon: '🚚', label: 'Suppliers', path: '/suppliers' },
    { icon: '📋', label: 'Purchase Orders', path: '/orders' },
    { icon: '💰', label: 'Sales', path: '/sales' },
    { icon: '📈', label: 'Reports', path: '/reports' },
    { icon: '📝', label: 'Activity Logs', path: '/logs' },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-primary-600 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white dark:bg-secondary-800 shadow-elevated transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600">Inventory</h1>
          <p className="text-sm text-secondary-500">Mall Management</p>
        </div>

        <nav className="px-4 py-6 space-y-2">
          {menuItems.map((item, index) => {
            if (item.separator) {
              return (
                <div key={index} className="flex items-center gap-3 px-4 py-4 mt-4">
                  <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-700" />
                  <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase">
                    {item.label}
                  </span>
                </div>
              )
            }

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors text-secondary-700 dark:text-secondary-200"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200 dark:border-secondary-700 space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors text-secondary-700 dark:text-secondary-200"
          >
            <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
            <span className="text-sm">{isDark ? 'Light' : 'Dark'} Mode</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-danger"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>

          {currentUser && (
            <div className="pt-2 mt-2 border-t border-secondary-200 dark:border-secondary-700">
              <p className="text-xs text-secondary-500 px-2">{currentUser.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content offset */}
      <div className="hidden md:block w-64" />
    </>
  )
}
