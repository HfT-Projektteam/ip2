import { getProfile } from '@services/SpotifyAPI'
import { type components as SpotifyComponents } from '@data/spotify-types'
type User = SpotifyComponents['schemas']['PrivateUserObject']

export async function setCurrentUser(): Promise<User | null> {
  return await getProfile()
    .then((user) => {
      if (user?.id == null) return null
      localStorage.setItem('spotifyId', user?.id)
      return user
    })
    .catch((err) => {
      console.error(err)
      return null
    })
}
