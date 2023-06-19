// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

const noop = (): any => {}
Object.defineProperty(window, 'scrollTo', { value: noop, writable: true })

beforeAll(() => {
  /* I have no fucking clue why but this fixed the error in NavBar/.test.ts:
  TypeError: Cannot read properties of undefined (reading 'addListener') 
  https://jestjs.io/docs/
  manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
  */
  global.matchMedia =
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    global.matchMedia ||
    function () {
      return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }
    }
})
