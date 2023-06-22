import {
  DislikeFilled,
  DislikeOutlined,
  HeartFilled,
  HeartOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
import {
  dislikePost,
  getDislikePost,
  getLikePost,
  likePost,
} from '@services/BackendAPI/component'
import { addSongToPlaylist, getTrack, getUser } from '@services/SpotifyAPI'
import { Button, Card, Col, Divider, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'

const { Meta } = Card
const { Link, Text } = Typography

const colStyle = {
  width: '40px',
  height: '40px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

interface PostProps {
  postObject: postInterface
  isFeed: boolean
}

export function Post({ postObject, isFeed }: PostProps): JSX.Element {
  const [post, setPost] = useState<trackInterface>()
  const [like, setLike] = useState(false)
  const [dislike, setDislike] = useState(false)
  const [profileName, setProfileName] = useState('')
  const [userRef, setUserRef] = useState('')

  useEffect(() => {
    getTrack(postObject.songId)
      .then((res) => {
        setPost(res)
      })
      .catch((err) => {
        console.error(err)
      })

    getLikePost(postObject.songId)
      .then((res) => {
        res === undefined ? setLike(false) : setLike(res)
      })
      .catch((err) => {
        console.error(err)
      })

    getDislikePost(postObject.songId)
      .then((res) => {
        res === undefined ? setDislike(false) : setDislike(res)
      })
      .catch((err) => {
        console.error(err)
      })

    getUser(postObject.creator.spotify_uri)
      .then((res) => {
        const userName = res?.display_name
        userName != null
          ? setProfileName(userName)
          : setProfileName('Max Muster')

        const userRef = res?.external_urls?.spotify
        userRef != null ? setUserRef(userRef) : setUserRef('')
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const likeSong = (): void => {
    setLike(!like)
    void likePost(postObject.uuid)
  }
  const dislikeSong = (): void => {
    setDislike(!dislike)
    void dislikePost(postObject.uuid)
  }

  return (
    <Row>
      <Col style={{ width: '100%' }}>
        <Row justify={'center'}>
          <Link href={userRef}>{profileName}</Link>
        </Row>
      </Col>
      <Col style={{ width: '100%' }}>
        <Card
          id={postObject.uuid}
          cover={<img alt='example' src={post?.imgUrl} />}
          actions={
            isFeed
              ? [
                  <>
                    <Row justify={'space-around'} align={'middle'}>
                      <Col style={colStyle}>
                        <Button
                          size={like ? 'large' : 'middle'}
                          type='primary'
                          shape='circle'
                          icon={
                            like ? (
                              <HeartFilled rev='LikeSongFill' />
                            ) : (
                              <HeartOutlined rev='LikeSong' />
                            )
                          }
                          onClick={likeSong}
                        />
                      </Col>
                      <Col style={colStyle}>
                        <Button
                          type='primary'
                          shape='circle'
                          icon={<PlusOutlined rev='AddSongToPlaylist' />}
                          onClick={() => {
                            void addSongToPlaylist(post?.spotifyId ?? '')
                          }}
                        />
                      </Col>
                      <Col style={colStyle}>
                        <Button
                          size={dislike ? 'large' : 'middle'}
                          type='primary'
                          shape='circle'
                          icon={
                            dislike ? (
                              <DislikeFilled rev='DislikeSong' />
                            ) : (
                              <DislikeOutlined rev='DislikeSong' />
                            )
                          }
                          onClick={dislikeSong}
                        />
                      </Col>
                    </Row>
                    <Row justify={'space-around'} align={'middle'}>
                      <Col style={colStyle}>
                        <Text>{postObject.likes}</Text>
                      </Col>
                      <Col style={colStyle}></Col>
                      <Col style={colStyle}>
                        <Text>{postObject.dislikes}</Text>
                      </Col>
                    </Row>
                  </>,
                ]
              : undefined
          }
        >
          <Meta
            title={
              <Row justify={'center'}>
                <Link href={'spotify:track:' + String(postObject.songId ?? '')}>
                  {post?.title}
                </Link>
              </Row>
            }
            description={
              <>
                <Row justify={'center'}>
                  <Link href={'spotify:album:' + String(post?.albumId ?? '')}>
                    {post?.album}
                  </Link>
                </Row>
                <Row justify={'center'}>
                  <Link href={'spotify:artist:' + String(post?.artistId ?? '')}>
                    {post?.artist}
                  </Link>
                </Row>
                <Divider />

                <Row justify={'center'}>
                  <Text>{postObject.description}</Text>
                </Row>
              </>
            }
          />
        </Card>
      </Col>
    </Row>
  )
}
