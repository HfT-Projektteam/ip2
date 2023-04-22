export type randomUID = string

export function generateRandomUID(): randomUID {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}
