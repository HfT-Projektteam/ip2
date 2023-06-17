import { NewPost } from './component'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@services/SpotifyAPI')

describe('Render Create NewPost Page', () => {
  it('should have all Components', async () => {
    act(() => render(<NewPost />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const buttons = await screen.findAllByRole('button')
    const textarea = await screen.findAllByRole('textbox')

    expect(buttons).toHaveLength(2)
    expect(textarea).toHaveLength(2)
  })

  it('should have all recent played songs', async () => {
    act(() => render(<NewPost />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const songList = await screen.findAllByRole('listitem')
    expect(songList).toHaveLength(10)
  })

  it('Input should be in the Input value', async () => {
    act(() => render(<NewPost />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const searchBox = await screen.findByPlaceholderText('Search Song')
    const commentBox = await screen.findByPlaceholderText('Say something')

    await act(async () => {
      userEvent.type(searchBox, 'Casper{enter}')
      userEvent.type(commentBox, 'The song is cool')
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(searchBox).toHaveValue('Casper')
    expect(commentBox).toHaveValue('The song is cool')
  })

  it('it should search for the song on spotify', async () => {
    act(() => render(<NewPost />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const searchBox = await screen.findByPlaceholderText('Search Song')

    await act(async () => {
      userEvent.type(searchBox, 'Casper{enter}')
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    const songList = screen.queryAllByRole('listitem')
    expect(songList).toHaveLength(3)
  })
})
