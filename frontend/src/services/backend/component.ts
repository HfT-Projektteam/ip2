import { getSpotifyUser } from '@services/SpotifyAPI'

const backendUrl = 'http://localhost:3001'
export function postUsers(): void {
  getSpotifyUser()
    .then(async (user) => {
      if (user?.uri !== null && user?.uri !== '') {
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: `{"spotify_uri": "${user?.uri ?? ''}"}`,
        }
        await fetch(`${backendUrl}/users`, options).catch((err) => {
          console.error(err)
        })
      }
    })
    .catch((err) => {
      console.error(err)
    })
}
