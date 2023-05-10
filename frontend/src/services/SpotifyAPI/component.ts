import { type trackInterface } from '@pages/Feed/Post'
import { generateRandomUID } from '@services/IdGenertor'
import { type components } from '@data/spotify-types'
type trackObject = components['schemas']['TrackObject']

export async function generateTrack(
  trackId: string,
  clientId: string,
  clientSecret: string,
): Promise<trackInterface> {
  const optionsBearer = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body:
      `grant_type=client_credentials` +
      `&client_id=${clientId}` +
      `&client_secret=${clientSecret}`,
  }

  return await request<{
    access_token: string
    token_type: string
    expires_in: number
  }>(`https://accounts.spotify.com/api/token`, optionsBearer)
    .then(async (res) => {
      const bearer = res.access_token

      const optionsTrack = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }

      return await request<trackObject>(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        optionsTrack,
      ).then((res) => {
        const post: trackInterface = {
          id: generateRandomUID(),
          title: res.name ?? 't',
          artist: res.artists?.at(0)?.name ?? 't',
          album: res.album?.name ?? 't',
          imgUrl: res.album?.images.at(0)?.url ?? 't',
        }
        return post
      })
    })
    .catch((err) => {
      console.error('Error while generating track:')
      console.error(err)

      const post: trackInterface = {
        id: generateRandomUID(),
        title: 'no data',
        artist: 'no data',
        album: 'no data',
        imgUrl: 'no data',
      }
      return post
    })
}

export async function getRandomTrack(
  clientId: string,
  clientSecret: string,
): Promise<trackInterface> {
  return await generateTrack('11dFghVXANMlKmJXsNCbNl', clientId, clientSecret)
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
