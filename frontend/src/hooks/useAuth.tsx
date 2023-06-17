import { AuthContext, type AuthContextValue } from '@context/AuthProvider'
import { useContext } from 'react'

export default function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
