import {
  type trackInterface,
  type postInterface,
} from '@pages/Feed/Post/interface'
import { getTrack } from '@services/SpotifyAPI/component'
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
      style={{ width: '300px' }}
      cover={<img alt='example' src={post?.imgUrl} />}
    >
      <Meta
        title={post?.title}
        description={`${post?.album ?? ''} \n ${post?.artist ?? ''}`}
      />
    </Card>

    /* old bootstrap example
    <Card key={props.id}>
      <Card.Img variant='top' src={props.imgUrl} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>{props.album}</Card.Text>
        <Card.Text>{props.artist}</Card.Text>
      </Card.Body>
    </Card>
    */
  )
}
