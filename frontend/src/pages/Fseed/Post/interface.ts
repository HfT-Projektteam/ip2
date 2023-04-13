import { type UUID } from 'crypto'

export interface postInterface {
  id: UUID
  title: string
  artist: string
  album: string
  imgUrl: string
}
