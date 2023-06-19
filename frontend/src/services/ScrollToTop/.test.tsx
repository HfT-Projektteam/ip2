import { render } from '@testing-library/react'
import ScrollToTop from '@services/ScrollToTop'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

describe('ScrollToTop', () => {
  it('Should be called with scrollTo(0,0)', () => {
    jest.spyOn(window, 'scrollTo')

    const history = createMemoryHistory()
    history.push = jest.fn()

    act(() => {
      render(
        <Router location={history.location} navigator={history}>
          <ScrollToTop />
        </Router>,
      )
    })
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
