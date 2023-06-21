import { render, screen, act } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import feedMock from '@data/mockdata/feed.json'

jest.mock('@services/SpotifyAPI')

describe('Post component', () => {
  it('should render Profile correctly', async () => {
    act(() => render(<Post postObject={feedMock.posts[0]} isFeed={true} />))

    await act(async () => {
      // Wait for the update in Post to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(await screen.findByText(/Title Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Album Name/i)).toBeInTheDocument()
    expect(await screen.findByText(/Artist Name/i)).toBeInTheDocument()
  })
})
