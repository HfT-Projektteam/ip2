export type randomUID = string

export function generateRandomUID(): randomUID {
  const timestamp = Date.now().toString(36).padStart(11, '0')
  const randomString = Math.random().toString(36).substring(2, 9)
  return timestamp + randomString
}
