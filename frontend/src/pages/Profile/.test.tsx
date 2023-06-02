import Profile from '@pages/Profile'
import { render } from '@testing-library/react'

describe('example', () => {
  it('should render Profile correctly', () => {
    const { getByText } = render(<Profile />)
    expect(getByText('My Profile')).toBeInTheDocument()
  })
})
