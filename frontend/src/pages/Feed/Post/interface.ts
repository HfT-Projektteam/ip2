import { type randomUID } from '@services/IdGenertor'

export interface postInterface {
  songId: string
  description: string
  genre?: string
  creator: {
    spotify_uri: string
  }
  uuid: string
  uploaded: string
  likes: number
  dislikes: number
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
