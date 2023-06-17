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
  artistId: string
  album: string
  albumId: string
  imgUrl: string
}
