import { render } from '@testing-library/react'
import NavBar from '@Components/ui/NavBar'

describe('NavBar', () => {
  it('should render Profile correctly', () => {
    const { getByText } = render(<NavBar />)

    expect(getByText('NavBar')).toBeInTheDocument()
  })
})
