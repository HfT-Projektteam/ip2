import { Feed } from './component'
import { act, render, screen } from '@testing-library/react'
import mockData from '@data/mockdata/feed.json'

jest.mock('@services/SpotifyAPI')

describe('example', () => {
  it('should render Feed component correctly', async () => {
    const feed = mockData
    await act(async () => {
      render(<Feed {...feed} />)
    }).then(async () => {
      expect(await screen.findAllByRole('img')).toHaveLength(3)
    })
  })
})
