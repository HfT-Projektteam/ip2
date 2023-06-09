/* eslint-disable react/jsx-key */
import {
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { generateRandomUID } from '@services/IdGenertor'
import { Button, Col, Row } from 'antd'
import { useNavigate } from 'react-router-dom'

const menuItems = [
  { route: '/feed', icon: <HomeOutlined rev={undefined} /> },
  { route: 'plus', icon: <PlusOutlined rev={undefined} /> },
  { route: '/search', icon: <SearchOutlined rev={undefined} /> },
  { route: '/profile', icon: <UserOutlined rev={undefined} /> },
]

export function NavBar(): JSX.Element {
  const navigate = useNavigate()

  return (
    <Row justify='space-evenly' align='middle'>
      {menuItems.map((item) => {
        return (
          <Col
            key={generateRandomUID()}
            span={4}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              size='large'
              type='primary'
              shape='circle'
              icon={item.icon}
              onClick={() => {
                navigate(item.route)
              }}
            />
          </Col>
        )
      })}
    </Row>
  )
}
