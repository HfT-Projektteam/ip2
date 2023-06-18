import useAuth from '@hooks/useAuth'
import { Navigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children }: any): JSX.Element {
  const { loginToken } = useAuth()
  const location = useLocation()

  if (loginToken === '') {
    return <Navigate to='/' replace state={{ from: location }} />
  }
  return children
}
