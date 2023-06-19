import Feed from '@pages/Feed'
import mockData from '@data/mockdata/feed.json'
import { ConfigProvider, Layout } from 'antd'
import { useEffect, useState } from 'react'
import Header from '@Components/layout/Header'
import { type feedInterface } from '@pages/Feed/interface'
import { Outlet, Route, Routes } from 'react-router-dom'
import Profile from '@pages/Profile'
import NavBar from '@Components/ui/NavBar'
import useWindowDimensions from '@hooks/useWindowDimensions'
import NewPost from '@pages/NewPost'
import Login from '@pages/Login'
import ProtectedRoute from '@pages/Login/ProtectedRoute'
import ScrollToTop from '@services/ScrollToTop'
import { useTheme } from '@hooks/useTheme'

const { Content, Footer } = Layout

function App(): JSX.Element {
  const [feed] = useState<feedInterface>(mockData)
  const { theme } = useTheme()

  return (
    <ConfigProvider theme={theme}>
      <ScrollToTop />
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
  const [containerWidth, setContainerWidth] = useState('100%')

  useEffect(() => {
    width <= 768 ? setContainerWidth('100%') : setContainerWidth('500px')
  }, [width])

  return (
    <ProtectedRoute>
      <Layout>
        <Layout.Header
          style={{
            position: 'fixed',
            top: '0',
            width: `${containerWidth}`,
            height: '60px',
            lineHeight: '60px',
            padding: 0,
            zIndex: 1,
          }}
        >
          <Header />
        </Layout.Header>

        <Content style={{ paddingBottom: '60px', paddingTop: '60px' }}>
          <Outlet />
        </Content>
        <Footer
          style={{
            position: 'fixed',
            bottom: '0',
            padding: '10px',
            width: `${containerWidth}`,
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
