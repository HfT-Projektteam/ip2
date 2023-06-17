/* eslint-disable max-len */
import Feed from '@pages/Feed'
import mockData from '@data/mockdata/feed.json'
import { ConfigProvider, Button, Layout } from 'antd'
import { useEffect, useState } from 'react'
import themesConfig from '@data/ThemesConfig'
import Header from '@Components/layout/Header'
import { type feedInterface } from '@pages/Feed/interface'
import { Route, Routes } from 'react-router-dom'
import Profile from '@pages/Profile'
import NavBar from '@Components/ui/NavBar'
import useWindowDimensions from '@hooks/useWindowDimensions'
import NewPost from '@pages/NewPost'
import Login, { ProtectedRoute } from '@pages/Login'
import useAuth from '@hooks/useAuth'

const { Content, Footer } = Layout
const { configThemeDefault, configThemeDark } = themesConfig

function App(): JSX.Element {
  const [theme, setTheme] = useState(configThemeDefault)

  const [feed] = useState<feedInterface>(mockData)

  const { width } = useWindowDimensions()
  const [footerWidth, setFooterWidth] = useState('100%')

  useEffect(() => {
    width <= 768 ? setFooterWidth('100%') : setFooterWidth('500px')
  }, [width])

  const themeChange = (): void => {
    theme === configThemeDefault
      ? setTheme(configThemeDark)
      : setTheme(configThemeDefault)
  }

  const { loginToken, onLogout } = useAuth()
  return (
    <>
      <ConfigProvider theme={theme}>
        <Layout>
          <Header></Header>
          NEW:
          {loginToken !== '' && (
            <Button type='primary' onClick={onLogout}>
              Logout
            </Button>
          )}
          <Button
            type='primary'
            size='large'
            onClick={() => {
              themeChange()
            }}
          >
            Switch Theme
          </Button>
          <Content style={{ paddingBottom: '60px' }}>
            <Routes>
              <Route index element={<Login />} />
              {/* <Route path='/login' element={<Login onLogin={handleLogin} />} /> */}
              <Route
                path='/feed'
                element={
                  <ProtectedRoute>
                    <Feed {...feed}></Feed>
                  </ProtectedRoute>
                }
              />
              <Route path='/plus' element={<NewPost />} />
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
