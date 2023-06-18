import ProtectedRoute from '@pages/Login/ProtectedRoute'
import { act, render, screen } from '@testing-library/react'

import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

describe('Protected Routes', () => {
  it('Should not render a protected page without access token and redirect to /', async () => {
    const history = createMemoryHistory()
    history.push = jest.fn()

    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <ProtectedRoute>
            <h1>Test</h1>
          </ProtectedRoute>
        </Router>,
      )
    })

    await act(async () => {
      // Wait for the update in Login to be complete
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })
})
