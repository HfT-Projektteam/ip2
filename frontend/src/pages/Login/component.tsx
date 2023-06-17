import useAuth from '@hooks/useAuth'
import { Button } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'

export function Login(): JSX.Element {
  const name = 'Login'

  const { onLogin } = useAuth()

  const login = async (): Promise<void> => {
    await onLogin()
  }

  return (
    <>
      <h1>{name}</h1>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button type='primary' onClick={login}>
        Login
      </Button>
    </>
  )
}

export function ProtectedRoute({ children }: any): JSX.Element {
  const { loginToken } = useAuth()
  const location = useLocation()

  if (loginToken === '') {
    return <Navigate to='/' replace state={{ from: location }} />
  }
  return children
}
