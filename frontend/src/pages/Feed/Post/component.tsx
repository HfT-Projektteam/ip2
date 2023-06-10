import { PlusCircleOutlined } from '@ant-design/icons'
import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
import { addSongToPlaylist, getTrack } from '@services/SpotifyAPI'
import { Card } from 'antd'
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
        <PlusCircleOutlined
          rev='' // WARUM muss das da sein????
          key={'addSongToPlaylist' + String(post?.id)}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await addSongToPlaylist(post?.spotifyId ?? '')
          }}
        />,
      ]}
    >
      <Meta
        title={post?.title}
        description={`${post?.album ?? ''} \n ${post?.artist ?? ''}`}
      />
    </Card>
  )
}
