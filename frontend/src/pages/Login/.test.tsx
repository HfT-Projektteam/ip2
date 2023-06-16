import Login from '@pages/Login'
import { render } from '@testing-library/react'

describe('Login', () => {
  it('should render Login Page correctly', () => {
    const { getByText } = render(<Login />)
    expect(getByText('Login')).toBeInTheDocument()
  })
})
