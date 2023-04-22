import { type randomUID } from '@services/IdGenertor'

export interface postInterface {
  id: randomUID
  title: string
  artist: string
  album: string
  imgUrl: string
}
