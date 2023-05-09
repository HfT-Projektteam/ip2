import { render, screen } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import postMock from '@data/mockdata/posts.json'

describe('Post', () => {
  const post = postMock.posts[0]

  it('should render Post component correctly', () => {
    render(<Post {...post} />)
    const elementImg = screen.getByRole('img')
    const title = screen.getByText(new RegExp(post.title, 'i'))
    const album = screen.getByText(new RegExp(post.album, 'i'))
    const artist = screen.getByText(new RegExp(post.artist, 'i'))
    expect(elementImg).toBeInTheDocument()
    expect(title).toBeInTheDocument()
    expect(album).toBeInTheDocument()
    expect(artist).toBeInTheDocument()
  })
})
