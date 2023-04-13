import { render, screen } from '@testing-library/react'
import { Post } from '@pages/Feed/Post'
import { type postInterface } from '@pages/Feed/Post/interface'
import crypto from 'crypto'

describe('Register component, ich habe keine Ahnung was ich hier mache', () => {
  const post: postInterface = {
    id: crypto.randomUUID(),
    title: 'Happy',
    artist: 'Cro',
    album: 'test',
    imgUrl:
      'https://images.unsplash.com/photo-1612999754243-3745bba6c302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=734&q=80',
  }

  it('should render Post component correctly', () => {
    render(<Post {...post} />)
    const element = screen.getByRole('img')
    expect(element).toBeInTheDocument()
  })
})
