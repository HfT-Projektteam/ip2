import { Feed } from './component'
import { act, render, screen } from '@testing-library/react'
import feedMock from '@data/mockdata/feed.json'
import { BrowserRouter } from 'react-router-dom'

jest.mock('@services/SpotifyAPI')
jest.mock('@services/BackendAPI')
jest.spyOn(window, 'scrollTo')

describe('Feed', () => {
  it('should render Feed correctly', async () => {
    act(() =>
      render(
        <Feed
          feed={feedMock}
          handleFeedChange={() => {}}
          genre={''}
          sort={'newest'}
        />,
        { wrapper: BrowserRouter },
      ),
    )

    await act(async () => {
      // Wait for the update in Post to complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(await screen.findAllByText('Title Name')).toHaveLength(3)
  })
})
