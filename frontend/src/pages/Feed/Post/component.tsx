import { PlusOutlined } from '@ant-design/icons'
import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
import { addSongToPlaylist, getTrack } from '@services/SpotifyAPI'
import { Button, Card } from 'antd'
import { useEffect, useState } from 'react'

const { Meta } = Card

export function Post(props: postInterface): JSX.Element {
  const [post, setPost] = useState<trackInterface>()

  useEffect(() => {
    getTrack(`${props.spotifyId}`)
      .then((res) => {
        setPost(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <Card
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
        title={post?.title}
        description={`${post?.album ?? ''} \n ${post?.artist ?? ''}`}
      />
    </Card>
  )
}
