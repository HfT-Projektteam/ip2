import useAuth from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { Button } from 'antd'
import { useLocation } from 'react-router-dom'

export const Header = (): JSX.Element => {
  const location = useLocation()

  return (
    <>
      <p>{'Header'}</p>
      <br />
      <>{location.pathname}</>
      <Settings />
    </>
  )
}

const Settings = (): JSX.Element => {
  const { changeTheme } = useTheme()
  const { handleLogout } = useAuth()

  return (
    <>
      <Button
        type='primary'
        size='large'
        onClick={() => {
          changeTheme()
        }}
      >
        Switch Theme
      </Button>
      <Button type='primary' onClick={handleLogout}>
        Logout
      </Button>
    </>
  )
}

/**
    <HeaderContainer>
      <Typography.Title style={{ margin: 0, fontSize: '48px' }}>
        Spotify Feed
      </Typography.Title>
      <PunchoutText
        background={defaultTheme.colors.mutedKhakiColorPalette.khakiLight}
      >
        This background is passed through props in a styled component
      </PunchoutText>
    </HeaderContainer>
 */
