import { type UUID } from 'crypto'

export interface postInterface {
  key: UUID
  title: string
  artist: string
  album: string
  imgUrl: string
}
