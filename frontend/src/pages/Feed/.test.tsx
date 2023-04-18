import { Feed } from "./component"
import { render, screen } from '@testing-library/react'

describe('example', () => {
  it('should render Feed component correctly', async () => {
    render(<Feed/>)
    const element = await screen.findAllByRole('img')
    expect(element).toHaveLength(3);
  })

  it('multiplies two numbers', () => {
    expect(5 * 5).toBe(25)
  })
})
