import { act, render, screen } from '@testing-library/react'
import { Follower } from './component'

jest.mock('@services/BackendAPI')
jest.mock('@services/SpotifyAPI')

describe('Follower', () => {
  it('should render Follower correctly', async () => {
    act(() => render(<Follower type='follower' />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const followerList = await screen.findAllByRole('listitem')
    expect(followerList).toHaveLength(4)
  })
})
