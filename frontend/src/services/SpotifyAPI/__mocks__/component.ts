import { type trackInterface } from '@pages/Feed/Post'
import { type components } from '@data/spotify-types'

type trackObject = components['schemas']['TrackObject']
type PrivateUserObject = components['schemas']['PrivateUserObject']
type PublicUserObject = components['schemas']['PublicUserObject']

export async function getTrack(trackId: string): Promise<trackInterface> {
  const mockedResponse: trackInterface = {
    id: 'bj4bk3rb4k3',
    spotifyId: 'bj4bk3rb4k3',
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

export async function searchSong(value: string): Promise<trackObject[] | null> {
  const mockedResponse: trackObject[] = [
    {
      id: 'testId1',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId2',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId3',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
  ]

  return await Promise.resolve(mockedResponse)
}

export async function getRecentPlayedTracks(): Promise<trackObject[] | null> {
  const mockedResponse: trackObject[] = [
    {
      id: 'testId1',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId2',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId3',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId4',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId5',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId6',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId7',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId8',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId9',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
    {
      id: 'testId10',
      name: 'testName',
      artists: [
        {
          name: 'testArtist',
          images: [
            {
              url: 'testUrl',
              height: 1,
              width: 1,
            },
          ],
        },
      ],
    },
  ]

  return await Promise.resolve(mockedResponse)
}

export async function getProfile(): Promise<PrivateUserObject | null> {
  return {
    id: 'Test.Id',
    display_name: 'Test Name',
  }
}

export async function getUser(
  userId: string,
): Promise<PublicUserObject | null> {
  return {
    id: 'Test.Id',
    display_name: 'Test Name',
    images: [{ url: 'testUrl', height: 10, width: 10 }],
  }
}
