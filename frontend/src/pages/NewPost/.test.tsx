import { NewPost } from './component'
import { render, screen } from '@testing-library/react'

jest.mock('@services/SpotifyAPI')

describe('Render Create Post Page', () => {
  it('should render the page to upload songs correctly', () => {
    render(<NewPost />)

    const button = screen.getByText('POST')

    expect(button).toBeInTheDocument()
  })
  it.todo('more tests needed')
})
