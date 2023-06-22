import useAuth from '@hooks/useAuth'
import { setAccessToken } from '@services/SpotifyAPI/Authorization'
import { Button, Col, Image, Row, Typography } from 'antd'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import spotify_logo from '@assets/Spotify_Logo_RGB_Black.png'
import { setCurrentUser } from '@services/Functions'
import { signIn } from '@services/BackendAPI'

const { Title } = Typography

export function Login(): JSX.Element {
  const navigate = useNavigate()
  const { handleLogin, handleLogout, setLoginToken } = useAuth()

  // ToDo: Set Timeout => Reload Page after 60min (when Access Token expires)
  // Or find clean solution => Open new Ticket
  useEffect(() => {
    setAccessToken()
      .then(() => {
        const token = window.localStorage.getItem('access_token') ?? ''
        setLoginToken(token)

        if (token !== '') {
          void signIn()
          void setCurrentUser()
          navigate('/feed')
        }
      })
      .catch(() => {
        handleLogout()
      })
  }, [])

  return (
    <>
      <Row style={{ height: '100vh', padding: '1em' }} align={'middle'}>
        <Row>
          <Col
            style={{
              width: '100%',
              borderBottom: '1px solid rgb(217, 218, 220)',
              padding: '10px',
              marginBottom: '30px',
              textAlign: 'center',
            }}
          >
            <Image
              src={spotify_logo}
              alt={spotify_logo}
              preview={false}
              width={'60%'}
            />
          </Col>
          <Col style={{ width: '100%', marginBottom: '30px' }}>
            <Button
              type='primary'
              onClick={handleLogin}
              block
              style={{ height: 'fit-content' }}
            >
              <Title level={2} style={{ margin: 0 }}>
                Please Login
              </Title>
            </Button>
          </Col>
        </Row>
      </Row>
    </>
  )
}
