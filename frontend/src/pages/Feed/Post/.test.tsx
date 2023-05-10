import { render, screen } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import feedMock from '@data/mockdata/feed.json'

describe('Post', () => {
  const post = feedMock.posts[0]

  it('should render Post component correctly', () => {
    render(<Post {...post} />)
    const elementImg = screen.getByRole('img')
    const title = screen.getByText(/We Will Rock You/i)
    const album = screen.getByText(/I Love Dad/i)
    const artist = screen.getByText(/Queen/i)
    expect(elementImg).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(album).toBeInTheDocument()
    expect(artist).toBeInTheDocument()
  })

  it.todo('how to test the post if the post is doing an api call?')
})
