import Feed from '@pages/Feed'
import mockData from '@data/mockdata/posts.json'
const feed = mockData
function App(): JSX.Element {
  return (
    <>
      <Feed {...feed}></Feed>
    </>
  )
}

export default App
