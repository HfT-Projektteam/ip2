import { render } from '@testing-library/react'
import NavBar from '@Components/ui/NavBar'
import { BrowserRouter } from 'react-router-dom'

describe('NavBar', () => {
  it('should render Navigation Bar correctly with 4 buttons', () => {
    const { getAllByRole } = render(<NavBar />, {
      wrapper: BrowserRouter,
    })
    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })
})
