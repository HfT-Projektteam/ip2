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
import { type postInterface } from '@pages/Feed/Post'

const { Content, Footer } = Layout

const { useToken } = antdTheme
const { configThemeDefault, configThemeDark } = themesConfig
const { Title } = Typography
// const feed = mockData

function App(): JSX.Element {
  const [theme, setTheme] = useState(configThemeDefault)
  const { token } = useToken()

  const [feed, setFeed] = useState<feedInterface>({ posts: [] })
  const [spotifyToken, setSpotifyToken] = useState('')

  const CLIENT_ID = '13faaa3d764b4601b62f0eb10866b1c7'
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const REDIRECT_URI = 'http://localhost:3000'
  const RESPONSE_TYPE = 'token'

  useEffect(() => {
    console.log('App: useEffect')
    const hash = window.location.hash
    let token = window.localStorage.getItem('token')
    if (token !== null) {
      setSpotifyToken(token)
      setFeed(mockData)
    }

    if (token == null && hash.length > 0) {
      token =
        hash
          .substr(1)
          .split('&')
          .find((elem) => elem.startsWith('access_token'))
          ?.split('=')[1] ?? null

      if (token != null) {
        window.location.hash = ''
        window.localStorage.setItem('token', token)
        setSpotifyToken(token)
        setFeed(mockData)
      }
    }
  }, [spotifyToken])

  const logout = (): void => {
    window.localStorage.removeItem('token')
    setSpotifyToken('')
  }

  const addSong = (): void => {
    const newPost: postInterface = {
      id: '32432532c3242',
      spotifyId: '11dFghVXANMlKmJXsNCbNl',
    }

    setFeed((prevFeed) => ({
      ...prevFeed,
      posts: [newPost, ...prevFeed.posts],
    }))
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
            <Button
              type='primary'
              href={
                `${AUTH_ENDPOINT}?` +
                `client_id=${CLIENT_ID}` +
                `&redirect_uri=${REDIRECT_URI}` +
                `&response_type=${RESPONSE_TYPE}`
              }
            >
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
          <Button type='primary' onClick={addSong}>
            Add Song
          </Button>
          <Content>
            {spotifyToken !== '' ? (
              <Feed {...feed}></Feed>
            ) : (
              <Title level={2}>Please login</Title>
            )}
          </Content>
          <Footer></Footer>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
