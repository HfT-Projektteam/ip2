import { type components as BackendComponents } from '@data/openapi'
type User = BackendComponents['schemas']['UserDto']

export async function getFollowers(page: number): Promise<User[] | null> {
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

export async function getFollowings(page: number): Promise<User[] | null> {
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

export async function getFollowingsNum(): Promise<number> {
  return 4
}

export async function getFollowersNum(): Promise<number> {
  return 4
}
