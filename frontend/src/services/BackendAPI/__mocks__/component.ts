import { type components as BackendComponents } from '@data/openapi'
import userMock from '@data/mockdata/user.json'
type User = BackendComponents['schemas']['User']

export async function getFollower(userId: string): Promise<User[] | null> {
  return userMock.users
}
