import Feed from '@pages/Feed'
import { ConfigProvider, Layout } from 'antd'
import { useEffect, useState } from 'react'
import Header from '@Components/layout/Header'
import {
  type HandleSortGenreChange,
  type feedInterface,
} from '@pages/Feed/interface'
import { Outlet, Route, Routes } from 'react-router-dom'
import Profile from '@pages/Profile'
import NavBar from '@Components/ui/NavBar'
import useWindowDimensions from '@hooks/useWindowDimensions'
import NewPost from '@pages/NewPost'
import Login from '@pages/Login'
import ProtectedRoute from '@pages/Login/ProtectedRoute'
import ScrollToTop from '@services/ScrollToTop'
import { useTheme } from '@hooks/useTheme'
import SearchPage from '@pages/Search'

const { Content, Footer } = Layout

function App(): JSX.Element {
  const { theme } = useTheme()

  const [feed, setFeed] = useState<feedInterface>({ posts: [] })

  const handleFeedChange = (newFeed: feedInterface): void => {
    setFeed(newFeed)
  }

  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('')
  const handleSortGenreChange = (isSort: boolean, newValue: string): void => {
    isSort ? setSort(newValue) : setGenre(newValue)
  }

  return (
    <ConfigProvider theme={theme}>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route
          element={
            <AppLayoutRoute handleSortGenreChange={handleSortGenreChange} />
          }
        >
          <Route
            path='/feed'
            element={
              <Feed
                feed={feed}
                handleFeedChange={handleFeedChange}
                genre={genre}
                sort={sort}
              />
            }
          />
          <Route path='/plus' element={<NewPost />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='*' element={'Route Not Found'} />
        </Route>
      </Routes>
    </ConfigProvider>
  )
}

interface AppLayoutRouteProps {
  handleSortGenreChange: HandleSortGenreChange['handleSortGenreChange']
}
export function AppLayoutRoute({
  handleSortGenreChange,
}: AppLayoutRouteProps): JSX.Element {
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
            top: 0,
            width: `${containerWidth}`,
            height: '60px',
            lineHeight: '60px',
            padding: 0,
            zIndex: 1,
          }}
        >
          <Header handleSortGenreChange={handleSortGenreChange} />
        </Layout.Header>

        <Content style={{ paddingBottom: '60px', paddingTop: '60px' }}>
          <Outlet />
        </Content>
        <Footer
          style={{
            position: 'fixed',
            bottom: 0,
            padding: 0,
            width: `${containerWidth}`,
            height: '60px',
          }}
        >
          <Layout.Header
            style={{ lineHeight: '60px', padding: 0, height: '60px' }}
          >
            <NavBar />
          </Layout.Header>
        </Footer>
      </Layout>
    </ProtectedRoute>
  )
}

export default App
