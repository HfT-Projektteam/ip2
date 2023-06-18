import Profile from '@pages/Profile'
import { act, render, screen } from '@testing-library/react'

jest.mock('@services/SpotifyAPI')
jest.mock('@services/BackendAPI')

describe('Profile', () => {
  it('should render Profile correctly', async () => {
    act(() => render(<Profile />))

    await act(async () => {
      // Wait for the update in Post to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(await screen.findByText('Test Name')).toBeInTheDocument()
  })
})
