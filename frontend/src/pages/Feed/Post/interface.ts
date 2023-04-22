import { type randomUID } from '@services/IdGenertor'

export interface postInterface {
  key: randomUID
  title: string
  artist: string
  album: string
  imgUrl: string
}
