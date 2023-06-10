import { type trackInterface } from '@pages/Feed/Post'
import { generateRandomUID } from '@services/IdGenertor'
import { type components } from '@data/spotify-types'
type trackObject = components['schemas']['TrackObject']
type PrivateUserObject = components['schemas']['PrivateUserObject']
type CursorPagingPlayHistoryObject =
  components['schemas']['CursorPagingPlayHistoryObject']

export async function getTrack(trackId: string): Promise<trackInterface> {
  const bearer = window.localStorage.getItem('access_token') ?? ''

  if (bearer === '') {
    console.error('Token was empty string')
  }

  const optionsTrack = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bearer}`,
    },
  }

  return await request<trackObject>(
    `https://api.spotify.com/v1/tracks/${trackId}`,
    optionsTrack,
  )
    .then((res) => {
      const post: trackInterface = {
        id: generateRandomUID(),
        title: res.name ?? 't',
        artist: res.artists?.at(0)?.name ?? 't',
        album: res.album?.name ?? 't',
        imgUrl: res.album?.images.at(0)?.url ?? 't',
      }
      return post
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

export async function getRandomTrack(): Promise<trackInterface> {
  return await getTrack('11dFghVXANMlKmJXsNCbNl')
}

export async function getProfile(): Promise<PrivateUserObject | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '') {
    return null
  }

  const options = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<PrivateUserObject>(
    'https://api.spotify.com/v1/me',
    options,
  )
    .then((user) => {
      return user
    })
    .catch((error) => {
      console.error('Error:', error)
      return null
    })
}

export async function searchSong(value: string): Promise<trackObject[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '') {
    return null
  }

  const options = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `https://api.spotify.com/v1/search?q=${value}&type=track&limit=10`,
    options,
  )
    .then((searchItems) => {
      return searchItems.tracks.items ?? null
    })
    .catch((error) => {
      console.error('Error in searchSong:', error)
      return null
    })
}

export async function getRecentPlayedTracks(): Promise<trackObject[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '') {
    return null
  }

  const options = {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<CursorPagingPlayHistoryObject>(
    `https://api.spotify.com/v1/me/player/recently-played?limit=10`,
    options,
  )
    .then((recentItems) => {
      const trackArray: trackObject[] = []
      recentItems.items?.forEach((track) => {
        if (track.track != null) {
          trackArray.push(track.track)
        }
      })
      return trackArray
    })
    .catch((error) => {
      console.error('Error in getRecentPlayedTracks:', error)
      return null
    })
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
