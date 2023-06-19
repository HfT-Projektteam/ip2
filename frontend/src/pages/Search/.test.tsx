import { act, render, screen } from '@testing-library/react'
import { SearchPage } from './component'
import userEvent from '@testing-library/user-event'

jest.mock('@services/SpotifyAPI')
jest.mock('@services/BackendAPI')

describe('Search', () => {
  it('should have all Components', async () => {
    act(() => render(<SearchPage />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const textarea = await screen.findAllByRole('textbox')

    expect(textarea).toHaveLength(1)
  })

  it('should find the users', async () => {
    act(() => render(<SearchPage />))

    await act(async () => {
      // Wait for the update in NewPost to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    const searchBox = await screen.findByPlaceholderText('Search User')

    await act(async () => {
      userEvent.type(searchBox, 'User Name{enter}')
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    const followerList = await screen.findAllByRole('listitem')
    expect(followerList).toHaveLength(4)
  })
})
