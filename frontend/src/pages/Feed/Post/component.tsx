import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
import { getTrack } from '@services/SpotifyAPI'
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
    <Card cover={<img alt='example' src={post?.imgUrl} />}>
      <Meta
        title={
          <a href={'spotify:track:' + String(props.spotifyId ?? '')}>
            {post?.title}
          </a>
        }
        description={
          <>
            <a href={'spotify:album:' + String(post?.albumId ?? '')}>
              {post?.album}
            </a>
            <br />
            <a href={'spotify:artist:' + String(post?.artistId ?? '')}>
              {post?.artist}
            </a>
          </>
        }
      />
    </Card>
  )
}
