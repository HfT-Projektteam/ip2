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
import { addSongToPlaylist, getTrack } from '@services/SpotifyAPI'
import { Button, Card, Col, Row, Typography } from 'antd'
import { useEffect, useState } from 'react'

const { Meta } = Card
const { Link } = Typography

interface PostProps {
  postObject: postInterface
  isFeed: boolean
}

export function Post({ postObject, isFeed }: PostProps): JSX.Element {
  const [post, setPost] = useState<trackInterface>()
  const [like, setLike] = useState(false)
  const [dislike, setDislike] = useState(false)

  useEffect(() => {
    getTrack(`${postObject.songId}`)
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
    <Card
      id={postObject.uuid}
      cover={<img alt='example' src={post?.imgUrl} />}
      actions={
        isFeed
          ? [
              <>
                <Row justify={'space-around'} align={'middle'}>
                  <Col
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
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
                  <Col
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Button
                      type='primary'
                      shape='circle'
                      icon={<PlusOutlined rev='AddSongToPlaylist' />}
                      onClick={() => {
                        void addSongToPlaylist(post?.spotifyId ?? '')
                      }}
                    />
                  </Col>
                  <Col
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
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
              </>,
            ]
          : undefined
      }
    >
      <Meta
        title={
          <Link href={'spotify:track:' + String(postObject.songId ?? '')}>
            {post?.title}
          </Link>
        }
        description={
          <>
            <Link href={'spotify:album:' + String(post?.albumId ?? '')}>
              {post?.album}
            </Link>
            <br />
            <Link href={'spotify:artist:' + String(post?.artistId ?? '')}>
              {post?.artist}
            </Link>
          </>
        }
      />
    </Card>
  )
}
