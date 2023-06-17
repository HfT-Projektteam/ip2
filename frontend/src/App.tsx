/* eslint-disable max-len */
import Feed from '@pages/Feed'
import mockData from '@data/mockdata/feed.json'
import { ConfigProvider, Button, Layout } from 'antd'
import { useEffect, useState } from 'react'
import themesConfig from '@data/ThemesConfig'
import Header from '@Components/layout/Header'
import { type feedInterface } from '@pages/Feed/interface'
import { Outlet, Route, Routes } from 'react-router-dom'
import Profile from '@pages/Profile'
import NavBar from '@Components/ui/NavBar'
import useWindowDimensions from '@hooks/useWindowDimensions'
import NewPost from '@pages/NewPost'
import Login, { ProtectedRoute } from '@pages/Login'
import useAuth from '@hooks/useAuth'

const { Content, Footer } = Layout
const { configThemeDefault, configThemeDark } = themesConfig

function App(): JSX.Element {
  const [feed] = useState<feedInterface>(mockData)
  const [theme, setTheme] = useState(configThemeDefault)
  const themeChange = (): void => {
    theme === configThemeDefault
      ? setTheme(configThemeDark)
      : setTheme(configThemeDefault)
  }
  return (
    <ConfigProvider theme={theme}>
      <Button
        type='primary'
        size='large'
        onClick={() => {
          themeChange()
        }}
      >
        Switch Theme
      </Button>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<AppLayoutRoute />}>
          <Route path='/feed' element={<Feed {...feed}></Feed>} />
          <Route path='/plus' element={<NewPost />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='*' element={'Route Not Found'} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}

export function AppLayoutRoute(): JSX.Element {
  /*
  weird concept to implement general Layout to multiple react routes
  https://reactrouter.com/en/main/start/concepts#layout-route
  */

  const { width } = useWindowDimensions()
  const [footerWidth, setFooterWidth] = useState('100%')

  useEffect(() => {
    width <= 768 ? setFooterWidth('100%') : setFooterWidth('500px')
  }, [width])

  const { handleLogout } = useAuth()
  return (
    <ProtectedRoute>
      <Layout>
        <Header></Header>
        <Button type='primary' onClick={handleLogout}>
          Logout
        </Button>

        <Content style={{ paddingBottom: '60px' }}>
          <Outlet />
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
    </ProtectedRoute>
  )
}

export default App
