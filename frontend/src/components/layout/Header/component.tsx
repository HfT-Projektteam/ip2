import {
  CheckOutlined,
  CloseOutlined,
  EllipsisOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import useAuth from '@hooks/useAuth'
import { useTheme } from '@hooks/useTheme'
import { Button, Col, Modal, Row, Space, Switch, Typography } from 'antd'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

const { Text } = Typography

const PostHeader = (): JSX.Element => {
  return <>Post</>
}

const SearchHeader = (): JSX.Element => {
  return <>Search</>
}

const FeedHeader = (): JSX.Element => {
  return <>Feed</>
}

const headersContent: Array<{ path: string; node: JSX.Element }> = [
  { path: 'feed', node: <FeedHeader /> },
  { path: 'search', node: <SearchHeader /> },
  { path: 'post', node: <PostHeader /> },
]

const ModalContainer = ({ children }: any): JSX.Element => {
  const [open, setOpen] = useState(false)

  const showModal = (): void => {
    setOpen(true)
  }

  return (
    <>
      <Button
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

export const Header = (): JSX.Element => {
  const location = useLocation()
  const headerContentObject = headersContent.find(
    (item) => '/' + item.path === location.pathname,
  )

  const HeaderContent =
    headerContentObject != null ? headerContentObject.node : <></>

  const { isDarkmode, changeTheme } = useTheme()
  const { handleLogout } = useAuth()

  return (
    <Row>
      <Col flex={'auto'}>{HeaderContent}</Col>
      <Col flex={'0'}>
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
  )
}
