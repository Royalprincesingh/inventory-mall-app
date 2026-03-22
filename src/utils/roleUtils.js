import { useAuth } from '../context/AuthContext'

export function useAuthRequired() {
  const { currentUser, userRole, loading } = useAuth()
  
  return {
    isAuthenticated: !!currentUser,
    user: currentUser,
    role: userRole,
    isLoading: loading,
  }
}

export function useRole(requiredRole) {
  const { userRole } = useAuth()
  
  if (!requiredRole) return true
  if (!userRole) return false
  
  const roleHierarchy = {
    'super_admin': 3,
    'store_manager': 2,
    'staff': 1,
  }
  
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0)
}

export function hasPermission(userRole, requiredRole) {
  const roleHierarchy = {
    'super_admin': 3,
    'store_manager': 2,
    'staff': 1,
  }
  
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0)
}
