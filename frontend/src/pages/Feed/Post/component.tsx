import { DislikeOutlined, LikeOutlined, PlusOutlined } from '@ant-design/icons'
import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
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

  useEffect(() => {
    getTrack(`${postObject.songId}`)
      .then((res) => {
        setPost(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const likeSong = async (): Promise<void> => {}
  const dislikeSong = async (): Promise<void> => {}

  return (
    <Card
      id={postObject.uuid}
      cover={<img alt='example' src={post?.imgUrl} />}
      actions={
        isFeed
          ? [
              <>
                <Row justify={'space-around'}>
                  <Col>
                    <Button
                      type='primary'
                      shape='circle'
                      icon={<LikeOutlined rev='LikeSong' />}
                      onClick={() => {
                        void likeSong()
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      type='primary'
                      shape='circle'
                      icon={<PlusOutlined rev='AddSongToPlaylist' />}
                      onClick={() => {
                        void addSongToPlaylist(post?.spotifyId ?? '')
                      }}
                    />
                  </Col>
                  <Col>
                    <Button
                      type='primary'
                      shape='circle'
                      icon={<DislikeOutlined rev='DislikeSong' />}
                      onClick={() => {
                        void dislikeSong()
                      }}
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
