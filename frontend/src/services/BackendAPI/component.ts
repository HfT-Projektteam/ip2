import { type components as BackendComponents } from '@data/openapi'
import { getProfile } from '@services/SpotifyAPI'
type User = BackendComponents['schemas']['UserDto']

const backendUri: string = process.env.REACT_APP_BACKEND_URI ?? ''

export async function getFollowers(): Promise<User[] | null> {
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
        `${backendUri}/users/${profile?.id}/follower?page=0&take=10`,
        options,
      )
        .then((user) => {
          console.log('user from Backend ', user)
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

export async function getFollowings(): Promise<User[] | null> {
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
        `${backendUri}/users/${profile?.id}/followings?page=0&take=10`,
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

async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
