import env from '@data/environment.config'

const clientId: string = env.spotifyClientId
const redirectUri: string = env.spotifyRedirectUri

export function redirectToSpotifyAuthorizeEndpoint(): void {
  const codeVerifier = generateRandomString(128)

  generateCodeChallenge(codeVerifier)
    .then((codeChallenge) => {
      const state = generateRandomString(16)
      const scope =
        'user-read-private user-read-email user-read-recently-played playlist-modify-public playlist-modify-private playlist-read-private'

      window.localStorage.setItem('code_verifier', codeVerifier)

      const args = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope,
        redirect_uri: redirectUri,
        state,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
      })

      window.location.assign(
        'https://accounts.spotify.com/authorize?' + args.toString(),
      )
    })
    .catch((err) => {
      console.error(err)
    })
}

function generateRandomString(length: number): string {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function getAccessToken(code: string): Promise<void> {
  const codeVerifier = window.localStorage.getItem('code_verifier') ?? ''

  if (codeVerifier === '' || code === '') {
    return
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: codeVerifier,
  })

  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status.toString())
      }
      return await response.json()
    })
    .then((data) => {
      window.localStorage.setItem('access_token', data.access_token)
      window.localStorage.setItem('refresh_token', data.refresh_token)
      window.localStorage.setItem('expires_in', data.expires_in)
    })
    .catch((_error) => {
      //  console.error('Error:', error)
    })
}

export async function getRefreshToken(refreshToken: string): Promise<void> {
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: clientId,
  })

  await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status.toString())
      }
      const body = await response.json()
      return body
    })
    .then((data) => {
      window.localStorage.setItem('access_token', data.access_token)
      window.localStorage.setItem('refresh_token', data.refresh_token)
      window.localStorage.setItem('expires_in', data.expires_in)
    })
    .catch((_error) => {
      // console.error('Error: ', error)
    })
}

export async function setAccessToken(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code') ?? ''
  const accessToken = window.localStorage.getItem('access_token') ?? ''
  const refreshToken = window.localStorage.getItem('refresh_token') ?? ''

  if (code !== '') {
    // received the code from spotify and exchange it for a access_token
    await getAccessToken(code)
      .then(() => {
        window.history.pushState({}, document.title, window.location.pathname)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  } else if (accessToken !== '' && refreshToken !== '') {
    // we are already authorized and refresh our token
    await getRefreshToken(refreshToken).catch((error) => {
      console.error('Error:', error)
    })
  } else {
    // logout
    window.localStorage.removeItem('access_token')
    window.localStorage.removeItem('refresh_token')
    window.localStorage.removeItem('expires_in')
    window.localStorage.removeItem('code_verifier')
  }
}
