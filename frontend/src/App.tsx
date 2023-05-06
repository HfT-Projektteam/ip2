import Feed from '@pages/Feed'
import mockData from '@data/mockdata/posts.json'
import { ConfigProvider, theme as antdTheme, Button } from 'antd'
import { useState } from 'react'
import themesConfig from '@data/ThemesConfig'

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
        <Feed {...feed}></Feed>
      </ConfigProvider>
    </>
  )
}

export default App
