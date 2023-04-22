import { Feed } from "./component"
import { render, screen } from '@testing-library/react'
import mockData from '@data/mockdata/feed.json'

describe('example', () => {
  it('should render Feed component correctly', async () => {
    const feed = mockData;
    render(<Feed {...feed}/>)
    const element = await screen.findAllByRole('img')
    expect(element).toHaveLength(3);
  })
})
