import { type components as BackendComponents } from '@data/openapi'

type User = BackendComponents['schemas']['UserDto']
type GetPost = BackendComponents['schemas']['GetPostDto']

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

// interface Sort  {a: operations['PostsController_findAll']['parameters']['query']}

/**
 *
 * @param genre = []
 * @param followerFeed = boolean (true: private, false: global)
 * @param sort = enum [newest, oldest, dislikes, likes]
 * @param page = pagination (0 for first take)
 * @param take = number of objects returned
 * @returns
 */

export async function getPosts(
  genre: string = '',
  followerFeed: boolean,
  sort: string = 'newest',
  page: number = 0,
  take: number = 10,
): Promise<GetPost[] | null> {
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

export async function getPrivatePosts(
  genre: string = '',
  followerFeed: boolean,
  sort: string = 'newest',
  page: number = 0,
  take: number = 10,
): Promise<GetPost[] | null> {
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
    `${backendUri}/posts/follower/?genre=${genre}&followerFeed=${String(
      followerFeed,
    )}&sort=${sort}&page=${page}&take=${take}`,
    options,
  )
    .then((posts) => {
      return posts.data
    })
    .catch((error) => {
      console.error('Error in getPrivatePosts:', error)
      return null
    })
}

export async function getUserPosts(): Promise<GetPost[] | null> {
  const accessToken = localStorage.getItem('access_token') ?? ''
  const spotifyId = localStorage.getItem('spotifyId') ?? ''

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
    `${backendUri}/users/${spotifyId}/posts/?page=0&take=50`,
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

export async function postPost(
  songId: string = '',
  description: string = '',
  genre: string = '',
): Promise<void> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || songId === '') {
    return
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      song_id: songId,
      description,
      genre,
    }),
  }

  return await request<any>(`${backendUri}/posts`, options).catch((error) => {
    console.error('Error in postPosts:', error)
  })
}

export async function signIn(): Promise<void> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '') {
    return
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  await request<any>(`${backendUri}/signIn`, options).catch((error) => {
    console.error('Error in signIn:', error)
  })
}

export async function postUser(spotifyId: string): Promise<void> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '') {
    return
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    body: JSON.stringify({
      spotify_uri: spotifyId,
    }),
  }

  await request<any>(`${backendUri}/users`, options).catch((error) => {
    console.error('Error in postUser:', error)
  })
}

/**
 *
 * @param uuid
 * @returns true if the post was liked, false if the like was removed
 */
export async function likePost(uuid: string): Promise<boolean | undefined> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || uuid == null) {
    return undefined
  }

  const options = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(`${backendUri}/posts/${uuid}/like`, options)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error in likePost:', error)
      return undefined
    })
}

/**
 * Returns
 * @param uuid
 * @returns true if the post was disliked, false if the dislike was removed
 */
export async function dislikePost(uuid: string): Promise<boolean | undefined> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || uuid == null) {
    return undefined
  }

  const options = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(`${backendUri}/posts/${uuid}/dislike`, options)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error in dislikePost:', error)
      return undefined
    })
}

/**
 *
 * @param uuid
 * @returns true if the post is liked by the user, false if not
 */
export async function getLikePost(uuid: string): Promise<boolean | undefined> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || uuid == null) {
    return undefined
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(`${backendUri}/posts/${uuid}/like`, options)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error in getLikePost:', error)
      return undefined
    })
}

/**
 *
 * @param uuid
 * @returns true if the post is liked by the user, false if not
 */
export async function getDislikePost(
  uuid: string,
): Promise<boolean | undefined> {
  const accessToken = localStorage.getItem('access_token') ?? ''

  if (accessToken === '' || uuid == null) {
    return undefined
  }

  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  }

  return await request<any>(`${backendUri}/posts/${uuid}/dislike`, options)
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error('Error in getDislikePost:', error)
      return undefined
    })
}

/**
 * Babo Function
 * @param url
 * @param options
 * @returns
 */
async function request<T>(url: string, options: RequestInit): Promise<T> {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return (await response.json()) as T
}
