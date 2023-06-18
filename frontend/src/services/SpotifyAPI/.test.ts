import { getTrack } from './component'
describe('Spotify API Test', () => {
  it('should throw a error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
    window.localStorage.setItem('access_token', '')
    getTrack('trackId')
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
  it.todo('All Spotify Tests')
})
