import { render } from '@testing-library/react'
import { Header } from './component'
import { BrowserRouter } from 'react-router-dom'

describe('Header', () => {
  it('should render Header Layout', () => {
    const { getByText, getAllByText } = render(<Header />, {
      wrapper: BrowserRouter,
    })
    expect(getByText('Header')).toBeInTheDocument()
  })

  it.skip('should render different content for feed, profile and search routes', () => {})
})
