import AuthProvider from '@context/AuthProvider'
import Login from '@pages/Login'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

jest.mock('@services/SpotifyAPI/Authorization')
jest.mock('@services/BackendAPI')

describe('Login', () => {
  const history = createMemoryHistory()

  beforeEach(async () => {
    // mock push function
    history.push = jest.fn()

    act(() => {
      render(
        <AuthProvider>
          <Router location={history.location} navigator={history}>
            <Login />
          </Router>
        </AuthProvider>,
      )
    })

    await act(async () => {
      // Wait for the update in Login to be complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })
  })

  it('should route to login page if there is no access token set', async () => {
    expect(screen.getByText('Please Login')).toBeInTheDocument()
    const buttons = await screen.getAllByRole('button')
    expect(buttons).toHaveLength(1)
  })

  it('should redirect if login button is clicked', async () => {
    // do stuff which leads to redirection
    const loginButton = await screen.getAllByRole('button').at(0)
    loginButton &&
      act(() => {
        userEvent.click(loginButton)
      })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(history.location.pathname).toBe('/')
  })

  // ToDo: Mock localStorage for test and set the access token valid
  it.todo(
    'should route to feed page if there is an access token set',
    async () => {
      // window.localStorage.setItem('access_token', '02kshl2')
      expect(screen.getByText('Switch Theme')).toBeInTheDocument()
    },
  )
})
