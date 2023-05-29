import Feed from '@pages/Feed'
import mockData from '@data/mockdata/feed.json'
import {
  ConfigProvider,
  theme as antdTheme,
  Button,
  Layout,
  Typography,
} from 'antd'
import { useEffect, useState } from 'react'
import themesConfig from '@data/ThemesConfig'
import Header from '@Components/layout/Header'
import { type feedInterface } from '@pages/Feed/interface'
import {
  getAccessToken,
  getRefreshToken,
  redirectToSpotifyAuthorizeEndpoint,
} from '@services/SpotifyAPI/Authorization'
import { Link, Route, Routes } from 'react-router-dom'
import Profile from '@pages/Profile'

const { Content, Footer } = Layout

const { useToken } = antdTheme
const { configThemeDefault, configThemeDark } = themesConfig
const { Title } = Typography

function App(): JSX.Element {
  const [theme, setTheme] = useState(configThemeDefault)
  const { token } = useToken()

  const [feed, setFeed] = useState<feedInterface>({ posts: [] })
  const [spotifyToken, setSpotifyToken] = useState('')
  const [, setRefreshToken] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code') ?? ''
    const accessToken = window.localStorage.getItem('access_token') ?? ''
    const refreshToken = window.localStorage.getItem('refresh_token') ?? ''

    if (code !== '') {
      // received the code from spotify and exchange it for a access_token
      getAccessToken(code)
        .then(() => {
          setSpotifyToken(window.localStorage.getItem('access_token') ?? '')
          setRefreshToken(window.localStorage.getItem('refresh_token') ?? '')
        })
        .catch((err) => {
          console.error(err)
        })
    } else if (accessToken !== '' && refreshToken !== '') {
      // we are already authorized and refresh our token
      console.log('get access_token by refresh_token')
      getRefreshToken(refreshToken)
        .then(() => {
          setSpotifyToken(window.localStorage.getItem('access_token') ?? '')
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      logout()
    }
  }, [])

  useEffect(() => {
    setFeed(mockData)
  }, [spotifyToken])

  const logout = (): void => {
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
    window.localStorage.removeItem('expires_in')
    window.localStorage.removeItem('code_verifier')
    setSpotifyToken('')
    setFeed({ posts: [] })
    // todo: code param aus url entfernen
  }

  const themeChange = (): void => {
    theme === configThemeDefault
      ? setTheme(configThemeDark)
      : setTheme(configThemeDefault)
  }

  return (
    <>
      <ConfigProvider theme={theme}>
        <Layout>
          <Header></Header>
          {spotifyToken === '' ? (
            <Button type='primary' onClick={redirectToSpotifyAuthorizeEndpoint}>
              Login
            </Button>
          ) : (
            <Button type='primary' onClick={logout}>
              Logout
            </Button>
          )}
          <Button
            type='primary'
            size='large'
            onClick={() => {
              themeChange()
              console.log(
                'I can access the current theme props through the token',
                token.colorPrimary,
              )
            }}
          >
            Switch Theme
          </Button>
          <Link to='/'>Home</Link>
          <Link to='/feed'>Feed</Link>
          <Link to='/profile'>Profile</Link>
          <Content>
            <Routes>
              <Route path='/' element={<Title level={2}>Home</Title>} />
              <Route
                path='/feed'
                element={
                  spotifyToken !== '' ? (
                    <Feed {...feed}></Feed>
                  ) : (
                    <Title level={2}>Please login</Title>
                  )
                }
              />
              <Route path='/profile' element={<Profile />} />
            </Routes>

            {/* ToDo: Routing with Login workflow ? */}
          </Content>
          <Footer></Footer>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
