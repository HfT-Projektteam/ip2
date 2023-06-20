import {
  CheckOutlined,
  CloseOutlined,
  EllipsisOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import useAuth from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import {
  Button,
  Col,
  Modal,
  Row,
  Space,
  Switch,
  Typography,
  Image,
  Select,
} from 'antd'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import spotify_logo from '@assets/Spotify_Icon_RGB_Black.png'
import {
  type feedInterface,
  type HandleFeedChange,
} from '@pages/Feed/interface'

const { Text } = Typography

const FeedHeader = ({ handleFeedChange }: HandleFeedChange): JSX.Element => {
  const handleGenreChange = (value: string): void => {
    const a: feedInterface = { posts: [{ id: 'a', spotifyId: '' }] }
    handleFeedChange(a)
    // GET API / Filter Feed by Genre
  }

  const handleSortingChange = (value: string): void => {
    const a: feedInterface = { posts: [{ id: 'a', spotifyId: '' }] }
    handleFeedChange(a)
    // GET API / Change Feed
  }

  // ToDo: Fetch Endpoint, which Genres are available
  return (
    <>
      <Col>
        <Select
          allowClear
          placeholder={'Genre'}
          style={{ width: 120 }}
          onChange={handleGenreChange}
          options={[
            { value: 'genre1', label: 'Rap' },
            { value: 'genre2', label: 'Indie' },
            { value: 'genre3', label: 'Pop' },
            { value: 'genre4', label: 'Singsang' },
          ]}
        />
      </Col>
      <Col>
        <Select
          allowClear
          placeholder={'Sort'}
          style={{ width: 120 }}
          onChange={handleSortingChange}
          options={[
            { value: 'liked', label: 'Rap' },
            { value: 'disliked', label: 'Indie' },
            { value: 'newest', label: 'Pop' },
            { value: 'oldest', label: 'Singsang' },
          ]}
        />
      </Col>
    </>
  )
}

// If you remove Text, adapt the Tests ! Maybe like Post with a data-tedId
const PostHeader = (): JSX.Element => {
  return <Text data-testid={'post-header'}>Post</Text>
}

const SearchHeader = (): JSX.Element => {
  return <Text>Search</Text>
}

const ProfileHeader = (): JSX.Element => {
  return <Text>Profile</Text>
}

const ModalContainer = ({ children }: any): JSX.Element => {
  const [open, setOpen] = useState(false)

  const showModal = (): void => {
    setOpen(true)
  }

  return (
    <>
      <Button
        data-testid='modal-button'
        type='primary'
        shape='circle'
        icon={<EllipsisOutlined rev={undefined} />}
        onClick={showModal}
      />
      <Modal
        title='Settings'
        open={open}
        onOk={() => {
          setOpen(false)
        }}
        onCancel={() => {
          setOpen(false)
        }}
        footer={null}
        width={'100%'}
        style={{ position: 'absolute', top: 0, right: 0, left: 0 }}
      >
        {children}
      </Modal>
    </>
  )
}

export const Header = ({ handleFeedChange }: HandleFeedChange): JSX.Element => {
  const location = useLocation()

  const headersContent: Array<{ path: string; node: JSX.Element }> = [
    { path: 'feed', node: <FeedHeader handleFeedChange={handleFeedChange} /> },
    { path: 'search', node: <SearchHeader /> },
    { path: 'plus', node: <PostHeader /> },
    { path: 'profile', node: <ProfileHeader /> },
  ]

  const headerContentObject = headersContent.find(
    (item) => '/' + item.path === location.pathname,
  )

  const HeaderContent =
    headerContentObject != null ? headerContentObject.node : <></>

  const { isDarkmode, changeTheme } = useTheme()
  const { handleLogout } = useAuth()

  return (
    <Row style={{ padding: '0 1em' }}>
      <Col style={{ marginRight: '1em' }} flex={'1'}>
        <Image
          style={{ width: '30px' }}
          src={spotify_logo}
          alt={spotify_logo}
          preview={false}
          width={'100%'}
        />
      </Col>
      <Col flex={'auto'}>
        <Row justify={'space-evenly'}>{HeaderContent}</Row>
      </Col>
      <Col flex={'1'}>
        <Row justify={'end'}>
          <Col>
            <ModalContainer>
              <Row style={{ width: '100%' }} align={'middle'} justify={'end'}>
                <Space size={20}>
                  <Col>
                    <Space size={'small'}>
                      <Text>Change Theme</Text>
                      <Switch
                        size='default'
                        checkedChildren={<CheckOutlined rev={undefined} />}
                        unCheckedChildren={<CloseOutlined rev={undefined} />}
                        onChange={changeTheme}
                        defaultChecked={isDarkmode}
                      />
                    </Space>
                  </Col>
                  <Col>
                    <Space size={'small'}>
                      <Text>Logout</Text>
                      <Button
                        type='primary'
                        shape='circle'
                        size='middle'
                        icon={<LogoutOutlined rev={undefined} />}
                        onClick={handleLogout}
                      />
                    </Space>
                  </Col>
                </Space>
              </Row>
            </ModalContainer>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
