import { type trackInterface } from '@pages/Feed/Post'
import { generateRandomUID } from '@services/IdGenertor'
import { type components } from '@data/spotify-types'
type trackObject = components['schemas']['TrackObject']
type PrivateUserObject = components['schemas']['PrivateUserObject']
type PlaylistObject = components['schemas']['PlaylistObject']
type PagingPlaylistObject = components['schemas']['PagingPlaylistObject']

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
        spotifyId: res.id ?? 't',
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
        spotifyId: 'no data',
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

async function createPlaylist(): Promise<PlaylistObject | null> {
  return await getProfile()
    .then(async (profile) => {
      const accessToken = localStorage.getItem('access_token') ?? ''

      if (accessToken === '' || profile?.id == null) {
        return null
      }

      const options = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ name: 'Friendify' }),
      }

      return await request<PlaylistObject>(
        `https://api.spotify.com/v1/users/${profile?.id}/playlists`,
        options,
      )
        .then((playlist) => {
          console.log('created Playlist')
          return playlist
        })
        .catch((error) => {
          console.error('Error in createPlaylist:', error)
          return null
        })
    })
    .catch((err) => {
      console.error(err)
      return null
    })
}

async function getPlaylist(name: string): Promise<PlaylistObject | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || name == null) {
    return null
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<PagingPlaylistObject>(
    `https://api.spotify.com/v1/me/playlists?limit=50`,
    options,
  )
    .then((playlists) => {
      let playlistretVal = null
      playlists.items?.every((playlist) => {
        console.log(`loade Name ${playlist.name ?? ''} === ${name}`)
        if (playlist.name === name) {
          playlistretVal = playlist
          return false
        }
        return false
      })
      return playlistretVal
    })
    .catch((error) => {
      console.error('Error in createPlaylist:', error)
      return null
    })
}

export async function addSongToPlaylist(songId: string): Promise<void> {
  await getPlaylist('Friendify').then(async (playlist) => {
    if (playlist == null) {
      await createPlaylist().then((newPlaylist) => {
        playlist = newPlaylist
      })
    }

    const accessToken = localStorage.getItem('access_token') ?? ''

    if (accessToken === '' || playlist?.id == null) {
      return
    }

    const options = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }

    await request<any>(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?` +
        `uris=spotify:track:${songId}`,
      options,
    )
      .then((recentItems) => {
        console.log('added song to playlist')
      })
      .catch((error) => {
        console.error('Error in addSongToPlaylist:', error)
        return null
      })
  })
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
