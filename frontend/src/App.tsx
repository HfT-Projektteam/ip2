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
  redirectToSpotifyAuthorizeEndpoint,
  setAccessToken,
} from '@services/SpotifyAPI/Authorization'
import { Route, Routes, useLocation } from 'react-router-dom'
import Profile from '@pages/Profile'
import NavBar from '@Components/ui/NavBar'
import useWindowDimensions from '@hooks/useWindowDimensions'
import NewPost from '@pages/NewPost'

const { Content, Footer } = Layout

const { useToken } = antdTheme
const { configThemeDefault, configThemeDark } = themesConfig
const { Title } = Typography

function App(): JSX.Element {
  const [theme, setTheme] = useState(configThemeDefault)
  const { token } = useToken()

  const [feed, setFeed] = useState<feedInterface>({ posts: [] })
  const [spotifyToken, setSpotifyToken] = useState('')

  const { width } = useWindowDimensions()
  const [footerWidth, setFooterWidth] = useState('100%')
  useEffect(() => {
    width <= 768 ? setFooterWidth('100%') : setFooterWidth('500px')
  }, [width])
  const location = useLocation()

  useEffect(() => {
    setAccessToken()
      .then(() => {
        setSpotifyToken(window.localStorage.getItem('access_token') ?? '')
      })
      .catch(() => {
        logout()
      })
  }, [location])

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
          <Content style={{ paddingBottom: '60px' }}>
            <Routes>
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
              <Route
                path='/plus'
                element={
                  spotifyToken !== '' ? (
                    <NewPost />
                  ) : (
                    <Title level={2}>Please login</Title>
                  )
                }
              />
              <Route path='/profile' element={<Profile />} />
              <Route path='*' element={'Route Not Found'} />
            </Routes>
          </Content>

          <Footer
            style={{
              position: 'fixed',
              bottom: '0',
              padding: '10px',
              width: `${footerWidth}`,
              height: '60px',
            }}
          >
            <Layout>
              <NavBar />
            </Layout>
          </Footer>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
