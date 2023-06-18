// eslint-disable-next-line max-len
import { redirectToSpotifyAuthorizeEndpoint } from '@services/SpotifyAPI/Authorization'
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useState,
} from 'react'

// context object structure
export interface AuthContextValue {
  loginToken: string
  setLoginToken: Dispatch<SetStateAction<string>>
  handleLogin: () => void
  handleLogout: () => void
}

const initValue: AuthContextValue = {
  loginToken: '',
  setLoginToken: (): void => {
    throw new Error('Function not implemented.')
  },
  handleLogin: (): void => {
    throw new Error('Function not implemented.')
  },
  handleLogout: (): void => {
    throw new Error('Function not implemented.')
  },
}

export const AuthContext = createContext<AuthContextValue>(initValue)

export default function AuthProvider({ children }: any): JSX.Element {
  const [loginToken, setLoginToken] = useState(initValue.loginToken)

  const handleLogin = (): void => {
    redirectToSpotifyAuthorizeEndpoint()
    // usually redirect with navigate hook but method above already redirects
  }

  const handleLogout = (): void => {
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
    window.localStorage.removeItem('expires_in')
    window.localStorage.removeItem('code_verifier')
    setLoginToken('')
  }

  const value: AuthContextValue = {
    loginToken,
    setLoginToken,
    handleLogin,
    handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
