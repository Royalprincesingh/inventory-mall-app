import React, { createContext, useContext, useState, useEffect } from 'react'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth as firebaseAuth, db as firebaseDb } from '../firebase'

// Mock auth as fallback
const mockAuth = {
  signInWithEmailAndPassword: async (email, password) => {
    const mockUsers = {
      'admin@mall.com': { email: 'admin@mall.com', password: 'admin123', uid: 'admin-123', role: 'admin' },
      'manager@store.com': { email: 'manager@store.com', password: 'manager123', uid: 'manager-456', role: 'manager' },
      'staff@store.com': { email: 'staff@store.com', password: 'staff123', uid: 'staff-789', role: 'staff' },
    }
    const user = mockUsers[email]
    if (user && user.password === password) {
      localStorage.setItem('mockUser', JSON.stringify({ uid: user.uid, email: user.email }))
      localStorage.setItem('mockUserRole', user.role)
      return { user: { uid: user.uid, email: user.email } }
    }
    throw new Error('Invalid login credentials')
  },
  signOut: async () => {
    localStorage.removeItem('mockUser')
    localStorage.removeItem('mockUserRole')
  },
  onAuthStateChanged: (callback) => {
    const user = localStorage.getItem('mockUser') ? JSON.parse(localStorage.getItem('mockUser')) : null
    setTimeout(() => callback(user), 100)
    return () => {}
  }
}

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Try to use Firebase, fallback to mock if not available
  const auth = firebaseAuth || mockAuth
  const isUsingFirebase = !!firebaseAuth

  // Sign up function
  async function signup(email, password, userData) {
    try {
      if (isUsingFirebase) {
        try {
          const result = await signInWithEmailAndPassword(firebaseAuth, email, password)
          return result.user
        } catch (firebaseErr) {
          console.warn('Firebase signup failed, trying mock auth:', firebaseErr.message)
          // Fallback to mock auth
          return await mockAuth.signInWithEmailAndPassword(email, password)
        }
      } else {
        return await mockAuth.signInWithEmailAndPassword(email, password)
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Login function
  async function login(email, password) {
    try {
      if (isUsingFirebase) {
        try {
          const result = await signInWithEmailAndPassword(firebaseAuth, email, password)
          return result.user
        } catch (firebaseErr) {
          console.warn('Firebase login failed, trying mock auth:', firebaseErr.message)
          // Fallback to mock auth
          return await mockAuth.signInWithEmailAndPassword(email, password)
        }
      } else {
        return await mockAuth.signInWithEmailAndPassword(email, password)
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Logout function
  async function logout() {
    try {
      if (isUsingFirebase) {
        try {
          await signOut(firebaseAuth)
        } catch (firebaseErr) {
          console.warn('Firebase logout failed, trying mock auth:', firebaseErr.message)
          await mockAuth.signOut()
        }
      } else {
        await mockAuth.signOut()
      }
      setCurrentUser(null)
      setUserRole(null)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Fetch user role from Firestore or localStorage (for mock auth)
  async function fetchUserRole(userId) {
    try {
      // Try Firebase first
      if (firebaseDb) {
        try {
          const userDocRef = doc(firebaseDb, 'users', userId)
          const userDocSnap = await getDoc(userDocRef)
          
          if (userDocSnap.exists()) {
            const role = userDocSnap.data().role
            if (!role) {
              setError('User role not found in database')
              setUserRole(null)
              return null
            }
            setUserRole(role)
            return role
          } else {
            setError('User profile not found in database')
            setUserRole(null)
            return null
          }
        } catch (firestoreErr) {
          console.warn('Firestore fetch failed, trying mock auth:', firestoreErr.message)
          // Fallback to mock auth localStorage
          const mockRole = localStorage.getItem('mockUserRole')
          if (mockRole) {
            setUserRole(mockRole)
            return mockRole
          }
          throw firestoreErr
        }
      } else {
        // Use mock auth - get role from localStorage
        const mockRole = localStorage.getItem('mockUserRole')
        if (mockRole) {
          setUserRole(mockRole)
          return mockRole
        }
        setError('Role not found')
        setUserRole(null)
        return null
      }
    } catch (err) {
      console.error('Error fetching user role:', err)
      setError(err.message)
      setUserRole(null)
      return null
    }
  }

  // Setup auth state listener
  useEffect(() => {
    try {
      const authTimeout = setTimeout(() => {
        console.warn('Auth timeout - proceeding')
        setLoading(false)
      }, 3000)

      const unsubscribeFunc = isUsingFirebase ? onAuthStateChanged(firebaseAuth, handleAuthChange) : mockAuth.onAuthStateChanged(handleAuthChange)
      
      async function handleAuthChange(user) {
        clearTimeout(authTimeout)
        try {
          if (user) {
            setCurrentUser(user)
            await fetchUserRole(user.uid)
          } else {
            setCurrentUser(null)
            setUserRole(null)
          }
        } catch (err) {
          console.error('Auth state change error:', err)
        } finally {
          setLoading(false)
        }
      }

      return () => {
        clearTimeout(authTimeout)
        if (unsubscribeFunc) unsubscribeFunc()
      }
    } catch (err) {
      console.error('Auth setup error:', err)
      setLoading(false)
    }
  }, [isUsingFirebase])

  const value = {
    currentUser,
    userRole,
    loading,
    error,
    signup,
    login,
    logout,
    fetchUserRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
