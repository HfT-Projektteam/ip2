import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['UserDto']
type GetPost = BackendComponents['schemas']['GetPostDto']

export async function getFollowers(
  spotifyId: string,
  type: string,
  page: number,
): Promise<User[] | null> {
  return [
    {
      spotify_uri: 'test1',
    },
    {
      spotify_uri: 'test2',
    },
    {
      spotify_uri: 'test3',
    },
    {
      spotify_uri: 'test4',
    },
  ]
}

export async function getFollowingsNum(spotifyId: string): Promise<number> {
  return 4
}

export async function getFollowersNum(spotifyId: string): Promise<number> {
  return 4
}

export async function searchUsers(
  spotifyId: string,
  page: number,
): Promise<User[] | null> {
  return [
    {
      spotify_uri: 'test1',
    },
    {
      spotify_uri: 'test2',
    },
    {
      spotify_uri: 'test3',
    },
    {
      spotify_uri: 'test4',
    },
  ]
}

export async function setFollower(
  spotifyIdCurrent: string,
  spotifyIdFollowing: string,
): Promise<void> {}

export async function getPosts(
  genre: string = '',
  followerFeed: boolean,
  sort: string = 'newest',
  page: number = 0,
  take: number = 10,
): Promise<GetPost[] | null> {
  return [
    {
      creator: { spotify_uri: 'spotify.user' },
      songId: '03jhnLcIT8C4DhXnNecOZv',
      description: 'Description',
      dislikes: 0,
      likes: 1,
      genre: 'rock',
      uploaded: '01.01.2023',
      uuid: '1234567890',
    },
  ]
}

export async function getPrivatePosts(
  genre: string = '',
  followerFeed: boolean,
  sort: string = 'newest',
  page: number = 0,
  take: number = 10,
): Promise<GetPost[] | null> {
  return [
    {
      creator: { spotify_uri: 'spotify.user' },
      songId: '03jhnLcIT8C4DhXnNecOZv',
      description: 'Description',
      dislikes: 0,
      likes: 1,
      genre: 'rock',
      uploaded: '01.01.2023',
      uuid: '1234567890',
    },
  ]
}

export async function postPost(
  songId: string = '',
  description: string = '',
  genre: string = '',
): Promise<void> {}

export async function signIn(): Promise<void> {}

export async function getUserPosts(): Promise<GetPost[] | null> {
  return [
    {
      creator: { spotify_uri: 'spotify.user' },
      songId: '103jhnLcIT8C4DhXnNecOZv',
      description: 'Description',
      dislikes: 0,
      likes: 1,
      genre: 'rock',
      uploaded: '01.01.2023',
      uuid: '1234567890',
    },
  ]
}

export async function getPostsById(
  spotifyId: string,
): Promise<GetPost[] | null> {
  return [
    {
      creator: { spotify_uri: 'spotify.user' },
      songId: '103jhnLcIT8C4DhXnNecOZv',
      description: 'Description',
      dislikes: 0,
      likes: 1,
      genre: 'rock',
      uploaded: '01.01.2023',
      uuid: '1234567890',
    },
  ]
}
