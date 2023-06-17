import { NewPost } from './component'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@services/SpotifyAPI')

describe('Render Create Post Page', () => {
  it('should have all Components', async () => {
    await act(async () => render(<NewPost />)).then(async () => {
      const buttons = await screen.findAllByRole('button')
      const textarea = await screen.findAllByRole('textbox')

      expect(buttons).toHaveLength(2)
      expect(textarea).toHaveLength(2)
    })
  })

  it('should have 10 recent played song', async () => {
    await act(async () => render(<NewPost />)).then(async () => {
      const songList = await screen.findAllByRole('listitem')
      expect(songList).toHaveLength(10)
    })
  })

  it('Input should be in the Input value', async () => {
    await act(async () => render(<NewPost />)).then(async () => {
      const searchBox = await screen.findByPlaceholderText('Search Song')
      const commentBox = await screen.findByPlaceholderText('Say something')

      userEvent.type(searchBox, 'Casper{enter}')
      userEvent.type(commentBox, 'The song is cool')

      await waitFor(() => {
        expect(searchBox).toHaveValue('Casper')
        expect(commentBox).toHaveValue('The song is cool')
      })
    })
  })

  it('it should search for the song on spotify', async () => {
    await act(async () => render(<NewPost />)).then(async () => {
      const searchBox = await screen.findByPlaceholderText('Search Song')

      userEvent.type(searchBox, 'Casper{enter}')

      await waitFor(() => {
        const songList = screen.queryAllByRole('listitem')
        expect(songList).toHaveLength(3)
      })
    })
  })
})
