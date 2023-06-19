import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import useAuth from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { Button, Switch } from 'antd'
import { useLocation } from 'react-router-dom'

export const Header = (): JSX.Element => {
  const location = useLocation()

  const headersContent: Array<{ path: string; node: JSX.Element }> = [
    { path: 'feed', node: <FeedHeader /> },
    { path: 'profile', node: <ProfileHeader /> },
  ]

  const headerContentObject = headersContent.find(
    (item) => '/' + item.path === location.pathname,
  )

  const headerContent =
    headerContentObject != null ? headerContentObject.node : <></>

  return (
    <>
      <p>{'Header'}</p>
      <br />
      {headerContent}
    </>
  )
}

const ProfileHeader = (): JSX.Element => {
  const { isDarkmode, changeTheme } = useTheme()
  const { handleLogout } = useAuth()

  return (
    <>
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
