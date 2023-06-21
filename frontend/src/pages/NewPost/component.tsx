import {
  getRecentPlayedTracks,
  searchSong,
  searchSongByLink,
} from '@services/SpotifyAPI'
import { Input, Space, Avatar, List, Button } from 'antd'
import { useEffect, useState } from 'react'
import { type components } from '@data/spotify-types'
import TextArea from 'antd/es/input/TextArea'
import { postPost } from '@services/BackendAPI'

const { Search } = Input
type trackObject = components['schemas']['TrackObject']

export function NewPost(): JSX.Element {
  const [songs, setSongs] = useState<trackObject[]>([])
  const [song, setSong] = useState<trackObject>()
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    getRecentPlayedTracks()
      .then((songs) => {
        setSongs(songs != null ? songs : [])
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const onSearch = async (value: string): Promise<void> => {
    if (value.includes('open.spotify.com')) {
      const urlSplitArray = value.split('/')
      const songId = urlSplitArray[urlSplitArray.length - 1]
      await searchSongByLink(songId)
        .then((song) => {
          if (song === null) {
            return
          }

          setSongs(song != null ? [song] : [])
        })
        .catch((err) => {
          console.error(err)
        })
    } else {
      await searchSong(value)
        .then((songs) => {
          setSongs(songs != null ? songs : [])
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  const onSongClick = (song: trackObject): void => {
    setSongs([song])
    setSong(song)
  }

  const onCommentChange = (comment: string): void => {
    setComment(comment)
  }

  const onPostClick = (): void => {
    void postPost(song?.id, comment, '')
  }

  return (
    <>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Search
          placeholder='Search Song'
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSearch={onSearch}
        />
      </Space>
      {songs.length > 0 ? (
        <List
          key='search.list'
          itemLayout='horizontal'
          dataSource={songs}
          renderItem={(song, index) => (
            <List.Item
              onClick={() => {
                onSongClick(song)
              }}
            >
              <List.Item.Meta
                avatar={<Avatar src={song?.album?.images.at(0)?.url} />}
                title={song?.name}
                description={song?.artists?.at(0)?.name}
              />
            </List.Item>
          )}
        />
      ) : (
        ''
      )}

      <TextArea
        rows={4}
        placeholder='Say something'
        onChange={(e) => {
          onCommentChange(e.target.value)
        }}
      />
      <Button
        type='primary'
        onClick={onPostClick}
        style={{ margin: '0 0 500px 0' }}
      >
        POST
      </Button>
    </>
  )
}
