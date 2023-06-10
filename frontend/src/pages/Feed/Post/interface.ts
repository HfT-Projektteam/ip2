import { type randomUID } from '@services/IdGenertor'

export interface postInterface {
  id: randomUID
  spotifyId: string
}

export interface trackInterface {
  id: randomUID
  spotifyId: string
  title: string
  artist: string
  album: string
  imgUrl: string
}
