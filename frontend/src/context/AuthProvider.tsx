import {
  redirectToSpotifyAuthorizeEndpoint,
  setAccessToken,
} from '@services/SpotifyAPI/Authorization'
import { createContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

// context object structure
export interface AuthContextValue {
  loginToken: string
  onLogin: () => Promise<void>
  onLogout: () => void
}

const initValue: AuthContextValue = {
  loginToken: '',
  onLogin: async (): Promise<void> => {
    throw new Error('Function not implemented.')
  },
  onLogout: (): void => {
    throw new Error('Function not implemented.')
  },
}

export const AuthContext = createContext<AuthContextValue>(initValue)

export default function AuthProvider({ children }: any): JSX.Element {
  const navigate = useNavigate()
  const [loginToken, setLoginToken] = useState(initValue.loginToken)

  const location = useLocation()

  // ToDo: Set Timeout => Reload Page after 60min (when Access Token expires)
  // Or find clean solution => Open new Ticket
  useEffect(() => {
    setAccessToken()
      .then(() => {
        const token = window.localStorage.getItem('access_token') ?? ''
        setLoginToken(token)
      })
      .catch(() => {
        handleLogout()
      })

    console.log('CALLED YAY')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const handleLogin = async (): Promise<void> => {
    redirectToSpotifyAuthorizeEndpoint()
    // usually redirect with navigate hook but method above already redirects
  }

  const handleLogout = (): void => {
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
    window.localStorage.removeItem('expires_in')
    window.localStorage.removeItem('code_verifier')
    setLoginToken('')
    navigate('/')
  }

  const value: AuthContextValue = {
    loginToken,
    onLogin: handleLogin,
    onLogout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
