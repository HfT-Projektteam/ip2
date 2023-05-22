import { render, waitFor, screen, act } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import feedMock from '@data/mockdata/feed.json'

jest.mock('@services/SpotifyAPI/component')

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

/* await act(async () => render(<Post {...feedMock.posts[0]} />))
      .then(async (res) => {
        return await new Promise((resolve) => setTimeout(resolve, 3000))
      })
      .then((res) => {
        const title = screen.getByText(/Title Name/i)
        expect(title).toBeInTheDocument()
      })
      .catch((err) => {
        console.error(err)
      }) */

// const title = screen.getByText(/Title Name/i)
// const album = screen.getByText(/Album Name/i)
// const artist = screen.getByText(/Artist Name/i)

// expect(title).toBeInTheDocument()
// expect(album).toBeInTheDocument()
// expect(artist).toBeInTheDocument()
