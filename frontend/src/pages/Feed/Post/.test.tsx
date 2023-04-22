import { render, screen } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import postMock from '@data/mockdata/posts.json'

describe('Post', () => {
  const post = postMock.posts[0]

  it('should render Post component correctly', () => {
    render(<Post {...post} />)
    const elementImg = screen.getByRole('img')
    const title = screen.getByText(post.title)
    const album = screen.getByText(post.album)
    const artist = screen.getByText(post.artist)
    expect(elementImg).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(album).toBeInTheDocument()
    expect(artist).toBeInTheDocument()
  })
})
