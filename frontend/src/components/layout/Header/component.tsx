import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import useAuth from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { Button, Switch } from 'antd'
import { useLocation } from 'react-router-dom'

export const Header = (): JSX.Element => {
  const location = useLocation()

  const Test: JSX.Element =
    location.pathname === '/feed' ? <FeedHeader /> : <Settings />

  return (
    <>
      <p>{'Header'}</p>
      <br />
      {Test}
    </>
  )
}

const Settings = (): JSX.Element => {
  const { isDarkmode, changeTheme } = useTheme()
  const { handleLogout } = useAuth()

  return (
    <>
      <Button type='primary' size='large' onClick={changeTheme}>
        Switch Theme
      </Button>
      <Switch
        checkedChildren={<CheckOutlined rev={undefined} />}
        unCheckedChildren={<CloseOutlined rev={undefined} />}
        onChange={changeTheme}
        defaultChecked={isDarkmode}
      />
      <Button type='primary' onClick={handleLogout}>
        Logout
      </Button>
    </>
  )
}

const FeedHeader = (): JSX.Element => {
  return <>Feed</>
}
