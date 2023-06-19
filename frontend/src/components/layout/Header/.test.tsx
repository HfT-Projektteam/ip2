import { render } from '@testing-library/react'
import { Header } from './component'

describe('Header', () => {
  it('should render Header Layout', () => {
    const { getByText } = render(<Header />)
    expect(getByText('Header')).toBeInTheDocument()
  })
})
