import { act, render, screen } from '@testing-library/react'
import { ProfileComponentPrivate } from './component'

jest.mock('@services/SpotifyAPI')
jest.mock('@services/BackendAPI')

describe('ProfileComponent', () => {
  it('should render ProfileComponent correctly', async () => {
    act(() => render(<ProfileComponentPrivate />))

    await act(async () => {
      // Wait for the update in Post to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(await screen.findByText(/Posts/i)).toBeInTheDocument()
    expect(await screen.findByText(/Follower/i)).toBeInTheDocument()
    expect(await screen.findByText(/Following/i)).toBeInTheDocument()
    expect(await screen.findByAltText(/avatar/i)).toBeInTheDocument()
  })
})
