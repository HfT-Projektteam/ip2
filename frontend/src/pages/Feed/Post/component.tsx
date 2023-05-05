import { type postInterface } from '@pages/Feed/Post/interface'
import { Card } from 'antd'

const { Meta } = Card

export function Post(props: postInterface): JSX.Element {
  return (
    <Card
      style={{ width: '300px' }}
      cover={<img alt='example' src={props.imgUrl} />}
    >
      <Meta
        title={props.title}
        description={`${props.album} \n ${props.artist}`}
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
