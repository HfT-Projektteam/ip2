import { render, screen } from '@testing-library/react'
import { Header } from './component'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('Header', () => {
  it('should render Header Layout with logo', () => {
    const { getByAltText, getByTestId } = render(
      <Header
        handleSortGenreChange={(isSort: boolean, newValue: string): void => {}}
      />,
      {
        wrapper: BrowserRouter,
      },
    )
    expect(getByAltText('Spotify_Icon_RGB_Black.png')).toBeInTheDocument()
    expect(getByTestId('modal-button')).toBeInTheDocument()
  })

  it('should render different header content based on the route', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/profile']}>
        <Header
          handleSortGenreChange={(
            isSort: boolean,
            newValue: string,
          ): void => {}}
        />
      </MemoryRouter>,
    )

    expect(queryByText('Search')).not.toBeInTheDocument()
    expect(getByText('Profile')).toBeInTheDocument()
  })

  it('should render different header content based on the route | reverse', () => {
    const { getByText, queryByText } = render(
      <MemoryRouter initialEntries={['/search']}>
        <Header
          handleSortGenreChange={(
            isSort: boolean,
            newValue: string,
          ): void => {}}
        />
      </MemoryRouter>,
    )

    expect(queryByText('Profile')).not.toBeInTheDocument()
    expect(getByText('Search')).toBeInTheDocument()
  })

  it('should render feed header on feed route', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/feed']}>
        <Header
          handleSortGenreChange={(
            isSort: boolean,
            newValue: string,
          ): void => {}}
        />
      </MemoryRouter>,
    )

    expect(
      container.getElementsByClassName('ant-select-selection-search').length,
    ).toBe(2)
  })

  it('should render post (route plus) header on feed route', () => {
    const { getByTestId } = render(
      <MemoryRouter initialEntries={['/plus']}>
        <Header
          handleSortGenreChange={(
            isSort: boolean,
            newValue: string,
          ): void => {}}
        />
      </MemoryRouter>,
    )

    expect(getByTestId('post-header')).toBeInTheDocument()
  })

  it('should open and close the modal', () => {
    const { queryByRole, getByTestId } = render(
      <Header
        handleSortGenreChange={(isSort: boolean, newValue: string): void => {}}
      />,
      {
        wrapper: BrowserRouter,
      },
    )

    expect(queryByRole('dialog')).not.toBeInTheDocument()

    const modalButton = getByTestId('modal-button')
    modalButton && userEvent.click(modalButton)

    const dialog = queryByRole('dialog')
    expect(dialog).toBeInTheDocument()

    const closeDialog = dialog?.getElementsByClassName('ant-modal-close')[0]
    closeDialog && userEvent.click(closeDialog)

    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })
})
