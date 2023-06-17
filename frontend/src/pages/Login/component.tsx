import useAuth from '@hooks/useAuth'
import { setAccessToken } from '@services/SpotifyAPI/Authorization'
import { Button } from 'antd'
import { useEffect } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export function Login(): JSX.Element {
  const name = 'Login'

  const navigate = useNavigate()
  const { handleLogin, handleLogout, setLoginToken } = useAuth()

  // ToDo: Set Timeout => Reload Page after 60min (when Access Token expires)
  // Or find clean solution => Open new Ticket
  useEffect(() => {
    setAccessToken()
      .then(() => {
        const token = window.localStorage.getItem('access_token') ?? ''
        setLoginToken(token)
        if (token !== '') navigate('/feed')
      })
      .catch(() => {
        handleLogout()
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <h1>{name}</h1>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <Button type='primary' onClick={handleLogin}>
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
