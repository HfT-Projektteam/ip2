import { getProfile } from '@services/SpotifyAPI'

export async function setCurrentUser(): Promise<void> {
  getProfile()
    .then((user) => {
      if (user?.id == null) return
      localStorage.setItem('spotifyId', user?.id)
    })
    .catch((err) => {
      console.error(err)
    })
}
