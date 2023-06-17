import { act, render, screen } from '@testing-library/react'
import { ProfileComponent } from './component'

jest.mock('@services/SpotifyAPI')

describe('ProfileComponent', () => {
  it('should render ProfileComponent correctly', async () => {
    act(() => render(<ProfileComponent />))

    await act(async () => {
      // Wait for the update in Post to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(await screen.findByText(/Posts/i)).toBeInTheDocument()
    expect(await screen.findByText(/Followers/i)).toBeInTheDocument()
    expect(await screen.findByText(/Following/i)).toBeInTheDocument()
    expect(await screen.findByAltText(/avatar/i)).toBeInTheDocument()
  })
})
