import { type components as BackendComponents } from '@data/openapi'
import userMock from '@data/mockdata/user.json'
type User = BackendComponents['schemas']['UserDto']

export async function getFollowers(userId: string): Promise<User[] | null> {
  return userMock.users
}
