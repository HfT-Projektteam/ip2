export default {
  spotifyRedirectUri:
    process.env.REACT_APP_SPOTIFY_REDIRECT_URI ?? 'http://localhost:3000/feed',
  spotifyClientId:
    process.env.REACT_APP_CLIENT_ID ?? '13faaa3d764b4601b62f0eb10866b1c7',
  backendUrl: process.env.REACT_APP_BACKEND_URL ?? 'http://localhost:3001',
}
