import { type Dispatch, type SetStateAction } from 'react'
export interface followerInterface {
  type: string
  spotify_id: string
  setSpotifyId: Dispatch<SetStateAction<string>>
}
