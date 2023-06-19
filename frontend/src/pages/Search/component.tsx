import { Input } from 'antd'

const { Search } = Input

export function SearchPage(): JSX.Element {
  const onSearch = async (value: string): Promise<void> => {}

  return (
    <>
      <Search
        placeholder='Search User'
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSearch={onSearch}
      />
    </>
  )
}
