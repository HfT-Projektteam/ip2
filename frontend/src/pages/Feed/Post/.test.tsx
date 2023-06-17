import { render, waitFor, screen, act } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import feedMock from '@data/mockdata/feed.json'

jest.mock('@services/SpotifyAPI')

describe('Post component', () => {
  it('should render Post component correctly', async () => {
    await act(async () => render(<Post {...feedMock.posts[0]} />)).then(
      async () => {
        expect(await screen.findByText(/Title Name/i)).toBeInTheDocument()
        expect(await screen.findByText(/Album Name/i)).toBeInTheDocument()
        expect(await screen.findByText(/Artist Name/i)).toBeInTheDocument()
      },
    )
  })
})
