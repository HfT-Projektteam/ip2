import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['UserDto']

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
