import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['UserDto']

const backendUri: string = process.env.REACT_APP_BACKEND_URI ?? ''

export async function getFollowers(
  spotifyId: string,
  type: string,
  page: number,
): Promise<User[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null) {
    return null
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/${type}?page=${page}&take=10`,
    options,
  )
    .then((user) => {
      return user.data
    })
    .catch((error) => {
      console.error('Error in getFollower:', error)
      return null
    })
}

export async function setFollower(
  spotifyIdCurrent: string,
  spotifyIdFollowing: string,
): Promise<void> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (
    accessToken === '' ||
    spotifyIdCurrent == null ||
    spotifyIdCurrent === '' ||
    spotifyIdFollowing == null ||
    spotifyIdFollowing === ''
  ) {
    return
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  await request<any>(
    `${backendUri}/users/${spotifyIdCurrent}/followings/${spotifyIdFollowing}`,
    options,
  )
    .then((user) => {})
    .catch((error) => {
      console.error('Error in getFollowersNum:', error)
    })
}

export async function getFollowersNum(spotifyId: string): Promise<number> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null || spotifyId === '') {
    return 0
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/follower?page=0&take=1`,
    options,
  )
    .then((user) => {
      return user.meta.itemCount
    })
    .catch((error) => {
      console.error('Error in getFollowersNum:', error)
      return 0
    })
}

export async function getFollowingsNum(spotifyId: string): Promise<number> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null || spotifyId === '') {
    return 0
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/followings?page=0&take=1`,
    options,
  )
    .then((user) => {
      return user.meta.itemCount
    })
    .catch((error) => {
      console.error('Error in getFollowingsNum:', error)
      return 0
    })
}

export async function searchUsers(
  spotifyId: string,
  page: number,
): Promise<User[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || spotifyId == null) {
    return null
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/users/${spotifyId}/search?page=${page}&take=10`,
    options,
  )
    .then((user) => {
      return user.data
    })
    .catch((error) => {
      console.error('Error in searchUsers:', error)
      return null
    })
}

export async function getPosts(
  genre: string = '',
  followerFeed: boolean,
  sort: string = 'newest',
  page: number = 0,
  take: number = 10,
): Promise<any[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '') {
    return null
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(
    `${backendUri}/posts/?genre=${genre}&followerFeed=${String(
      followerFeed,
    )}&sort=${sort}&page=${page}&take=${take}`,
    options,
  )
    .then((posts) => {
      return posts.data
    })
    .catch((error) => {
      console.error('Error in getPosts:', error)
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
