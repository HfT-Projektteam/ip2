import Feed from '@pages/Feed'
import mockData from '@data/mockdata/feed.json'
import { ConfigProvider, theme as antdTheme, Button, Layout } from 'antd'
import { useState } from 'react'
import themesConfig from '@data/ThemesConfig'
import Header from '@Components/layout/Header'

const { Content, Footer } = Layout

const { useToken } = antdTheme
const { configThemeDefault, configThemeDark } = themesConfig
const feed = mockData

function App(): JSX.Element {
  const [theme, setTheme] = useState(configThemeDefault)
  const { token } = useToken()

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
          <Content>
            <Feed {...feed}></Feed>
          </Content>
          <Footer></Footer>
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
