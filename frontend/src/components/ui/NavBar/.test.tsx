import { fireEvent, render } from '@testing-library/react'
import NavBar from '@Components/ui/NavBar'
import { BrowserRouter, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

describe('NavBar', () => {
  it('should render Navigation Bar correctly with 4 buttons', () => {
    const { getAllByRole } = render(<NavBar />, {
      wrapper: BrowserRouter,
    })
    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(4)
  })

  it('should route to a new route when a button is clicked', async () => {
    const history = createMemoryHistory()

    // mock push function
    history.push = jest.fn()

    const { getAllByRole } = render(
      <Router location={history.location} navigator={history}>
        <NavBar />
      </Router>,
    )
    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(4)

    const profileButton = buttons.at(3)
    profileButton && fireEvent.click(profileButton)

    // spy on push calls, assert on url (parameter)
    expect(history.push).toHaveBeenCalledWith(
      {
        hash: '',
        pathname: '/profile',
        search: '',
      },
      undefined,
      {},
    )

    const feedButton = buttons.at(0)
    feedButton && fireEvent.click(feedButton)
    expect(history.push).toHaveBeenCalledWith(
      {
        hash: '',
        pathname: '/feed',
        search: '',
      },
      undefined,
      {},
    )
  })
})
