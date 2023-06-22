import { NewPost } from './component'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'

jest.mock('@services/SpotifyAPI')
jest.spyOn(window, 'scrollTo')

describe('Render Create NewPost Page', () => {
  it('should have all Components', async () => {
    act(() => render(<NewPost />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const buttons = await screen.findAllByRole('button')
    const textarea = await screen.findAllByRole('textbox')

    expect(buttons).toHaveLength(1)
    expect(textarea).toHaveLength(1)
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

  it('Song Input should be in the Input value', async () => {
    act(() => render(<NewPost />, { wrapper: BrowserRouter }))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const searchBox = await screen.findByPlaceholderText('Search Song')

    await act(async () => {
      userEvent.type(searchBox, 'Casper{enter}')
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(searchBox).toHaveValue('Casper')
  })

  it('Comment Input should be in the Input value', async () => {
    act(() => render(<NewPost />, { wrapper: BrowserRouter }))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const item = (await screen.findAllByRole('listitem')).at(0)

    await act(async () => {
      item && userEvent.click(item)
    })

    const commentBox = await screen.findByPlaceholderText('Say something')

    await act(async () => {
      userEvent.type(commentBox, 'The song is cool')
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

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

  it('it should search for the song on spotify by url', async () => {
    act(() => render(<NewPost />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const searchBox = await screen.findByPlaceholderText('Search Song')

    await act(async () => {
      userEvent.type(
        searchBox,
        'open.spotify.com/intl-de/track/7zsbXuBCvVmYMlav9OWdYv',
      )
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    const songList = screen.queryAllByRole('listitem')
    expect(songList).toHaveLength(10)
  })
})
