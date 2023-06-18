import AuthProvider from '@context/AuthProvider'
import Login from '@pages/Login'
import { fireEvent, render } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

describe('Login', () => {
  it('should route to login page if there is no access token set', () => {
    const history = createMemoryHistory()

    // mock push function
    history.push = jest.fn()

    const { getByText, getAllByRole } = render(
      <AuthProvider>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </AuthProvider>,
    )
    expect(getByText('Please Login')).toBeInTheDocument()

    const buttons = getAllByRole('button')
    expect(buttons).toHaveLength(1)
  })

  it('should redirect if login button is clicked', async () => {
    const history = createMemoryHistory()

    const { getAllByRole } = render(
      <AuthProvider>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </AuthProvider>,
    )

    // do stuff which leads to redirection
    const loginButton = getAllByRole('button').at(0)
    loginButton && fireEvent.click(loginButton)

    expect(history.location.pathname).toBe('/')
  })

  // ToDo: Mock localStorage for test and set the access token valid
  it.skip('should route to feed page if there is an access token set', async () => {
    window.localStorage.setItem('access_token', '02kshl2')
    const history = createMemoryHistory()

    // mock push function
    history.push = jest.fn()

    const { getByText } = render(
      <AuthProvider>
        <Router location={history.location} navigator={history}>
          <Login />
        </Router>
      </AuthProvider>,
    )

    expect(getByText('Switch Theme')).toBeInTheDocument()
  })
})
