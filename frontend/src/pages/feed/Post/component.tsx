import { type postInterface } from '@pages/Feed/Post/interface'
import Card from 'react-bootstrap/Card'

export function Post (props: postInterface): JSX.Element {
  return (
    <>
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={props.imgUrl} />
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.album}
        </Card.Text>
        <Card.Text>
          {props.artist}
        </Card.Text>
      </Card.Body>
    </Card>
    </>
  )
}
