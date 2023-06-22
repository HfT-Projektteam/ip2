import Profile from '@pages/Profile'
import { act, render, screen } from '@testing-library/react'

jest.mock('@services/SpotifyAPI')
jest.mock('@services/BackendAPI')

describe('Profile', () => {
  it('should have 1 Posted Song in the Profile', async () => {
    act(() => render(<Profile />))

    await act(async () => {
      // Wait for the update in Post to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(await screen.getAllByText('Test Name')).toHaveLength(1)
  })
})
