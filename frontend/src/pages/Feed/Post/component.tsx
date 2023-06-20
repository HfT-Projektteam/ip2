import { PlusOutlined } from '@ant-design/icons'
import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
import { addSongToPlaylist, getTrack } from '@services/SpotifyAPI'
import { Button, Card, Typography } from 'antd'
import { useEffect, useState } from 'react'

const { Meta } = Card
const { Link } = Typography

export function Post(props: postInterface): JSX.Element {
  const [post, setPost] = useState<trackInterface>()

  useEffect(() => {
    getTrack(`${props.spotifyId}`)
      .then((res) => {
        setPost(res)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <Card
      id={props.id}
      cover={<img alt='example' src={post?.imgUrl} />}
      actions={[
        <>
          <Button
            type='primary'
            shape='circle'
            icon={<PlusOutlined rev='AddSongToPlaylist' />}
            onClick={() => {
              void addSongToPlaylist(post?.spotifyId ?? '')
            }}
          />
        </>,
      ]}
    >
      <Meta
        title={
          <Link href={'spotify:track:' + String(props.spotifyId ?? '')}>
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
