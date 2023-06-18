import { type components as BackendComponents } from '@data/openapi'
import { getProfile } from '@services/SpotifyAPI'
type User = BackendComponents['schemas']['UserDto']

const backendUri: string = process.env.REACT_APP_BACKEND_URI ?? ''

export async function getFollowers(
  type: string,
  page: number,
): Promise<User[] | null> {
  return await getProfile()
    .then(async (profile) => {
      const accessToken = localStorage.getItem('access_token') ?? ''

      if (accessToken === '' || profile?.id == null) {
        return null
      }

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }

      return await request<any>(
        `${backendUri}/users/${profile?.id}/${type}?page=${page}&take=10`,
        options,
      )
        .then((user) => {
          return user.data
        })
        .catch((error) => {
          console.error('Error in getFollower:', error)
          return null
        })
    })
    .catch((err) => {
      console.error(err)
      return null
    })
}

export async function getFollowersNum(): Promise<number> {
  return await getProfile()
    .then(async (profile) => {
      const accessToken = localStorage.getItem('access_token') ?? ''

      if (accessToken === '' || profile?.id == null) {
        return 0
      }

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }

      return await request<any>(
        `${backendUri}/users/${profile?.id}/follower?page=0&take=1`,
        options,
      )
        .then((user) => {
          return user.meta.itemCount
        })
        .catch((error) => {
          console.error('Error in getFollowersNum:', error)
          return 0
        })
    })
    .catch((err) => {
      console.error(err)
      return 0
    })
}

export async function getFollowingsNum(): Promise<number> {
  return await getProfile()
    .then(async (profile) => {
      const accessToken = localStorage.getItem('access_token') ?? ''

      if (accessToken === '' || profile?.id == null) {
        return 0
      }

      const options = {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      }

      return await request<any>(
        `${backendUri}/users/${profile?.id}/followings?page=0&take=1`,
        options,
      )
        .then((user) => {
          return user.meta.itemCount
        })
        .catch((error) => {
          console.error('Error in getFollowingsNum:', error)
          return 0
        })
    })
    .catch((err) => {
      console.error(err)
      return 0
    })
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
