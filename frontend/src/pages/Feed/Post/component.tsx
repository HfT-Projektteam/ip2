import { type postInterface } from '@pages/Feed/Post/interface'
import { Card } from 'antd'

const { Meta } = Card

export function Post(props: postInterface): JSX.Element {
  return (
    <Card cover={<img alt='example' src={props.imgUrl} />}>
      <Meta
        title={props.title}
        description={`${props.album} \n ${props.artist}`}
      />
    </Card>
  )
}
