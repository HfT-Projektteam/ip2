import { act, render, screen } from '@testing-library/react'
import { Header } from './component'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { debug } from 'console'

describe('Header', () => {
  it('should render Header Layout with logo', () => {
    const { getByAltText, getByTestId } = render(<Header />, {
      wrapper: BrowserRouter,
    })
    expect(getByAltText('Spotify_Icon_RGB_Black.png')).toBeInTheDocument()
    expect(getByTestId('modal-button')).toBeInTheDocument()
  })

  it('should render different header content based on the route', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <Header />
      </MemoryRouter>,
    )

    expect(queryByText('Search')).not.toBeInTheDocument()
    expect(getByText('Profile')).toBeInTheDocument()
  })

  it('should render different header content based on the route | reverse', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/search']}>
        <Header />
      </MemoryRouter>,
    )

    expect(queryByText('Profile')).not.toBeInTheDocument()
    expect(getByText('Search')).toBeInTheDocument()
  })

  it('should render feed header on feed route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/feed']}>
        <Header />
      </MemoryRouter>,
    )

    expect(
      container.getElementsByClassName('ant-select-selection-search').length,
    ).toBe(2)
  })

  it('should render post (route plus) header on feed route', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/plus']}>
        <Header />
      </MemoryRouter>,
    )

    expect(getByTestId('post-header')).toBeInTheDocument()
  })

  it('should open an already closed modal', () => {
    const { container } = render(<Header />, {
      wrapper: BrowserRouter,
    })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    const modalButton = screen.getByTestId('modal-button')
    modalButton && userEvent.click(modalButton)

    expect(screen.queryByRole('dialog')).toBeInTheDocument()
  })
})
