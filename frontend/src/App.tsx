
import { helloWorld } from '@pages/Feed'
import Feed from '@pages/Feed/component'

function App (): JSX.Element {
  return (
    <>
      <Feed></Feed>
      {helloWorld}
    </>
  )
}

export default App
