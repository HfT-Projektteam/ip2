import { type trackInterface } from '@pages/Feed/Post'

export async function getTrack(trackId: string): Promise<trackInterface> {
  const mockedResponse: trackInterface = {
    id: 'bj4bk3rb4k3',
    imgUrl:
      'https://thumbs.dreamstime.com/b/' +
      'example-red-tag-example-red-square-price-tag-117502755.jpg',
    title: 'Title Name',
    album: 'Album Name',
    albumId: 'Album Id',
    artist: 'Artist Name',
    artistId: 'Artist Id',
  }

  return await Promise.resolve(mockedResponse)
}
