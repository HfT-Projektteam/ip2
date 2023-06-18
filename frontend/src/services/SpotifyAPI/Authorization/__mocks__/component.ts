export async function setAccessToken(): Promise<void> {
  window.localStorage.setItem('access_token', 'hjsahds783')
  /* window.localStorage.removeItem('refresh_token')
      window.localStorage.removeItem('expires_in')
      window.localStorage.removeItem('code_verifier') */
}

export function redirectToSpotifyAuthorizeEndpoint(): void {}
