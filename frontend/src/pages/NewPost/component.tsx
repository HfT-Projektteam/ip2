import {
  getRecentPlayedTracks,
  searchSong,
  searchSongByLink,
} from '@services/SpotifyAPI'
import { Input, Space, Avatar, List, Button, Col } from 'antd'
import { useEffect, useState } from 'react'
import { type components } from '@data/spotify-types'
import TextArea from 'antd/es/input/TextArea'
import useWindowDimensions from '@hooks/useWindowDimensions'

const { Search } = Input
type trackObject = components['schemas']['TrackObject']

export function NewPost(): JSX.Element {
  const [songs, setSongs] = useState<trackObject[]>([])
  const [songId, setSongId] = useState<string>('')
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
          setSongId(song.id ?? '')
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
    setSongId(song.id ?? '')
  }

  const onCommentChange = (comment: string): void => {
    setComment(comment)
  }

  const onPostClick = (): void => {
    alert(
      `POST to backend not implemented yet\n` +
        ` Spotify songID: ${songId} comment: ${comment}`,
    )
    // todo: Send all Data to the backend
  }

  const { width } = useWindowDimensions()
  const [containerWidth, setContainerWidth] = useState('100%')

  useEffect(() => {
    width <= 768 ? setContainerWidth('100%') : setContainerWidth('500px')
  }, [width])

  return (
    <>
      <span
        style={{
          position: 'fixed',
          width: `${containerWidth}`,
          background: '#f5f5f5',
          height: '42px',
          zIndex: 2,
          marginBottom: '10px',
        }}
      ></span>
      <Col style={{ padding: '10px' }}>
        <Space
          direction='vertical'
          style={{
            position: 'fixed',
            width: `${containerWidth}`,
            paddingRight: '20px',
            zIndex: 2,
          }}
        >
          <Search placeholder='Search Song' onSearch={() => onSearch} />
        </Space>

        {songs.length > 0 ? (
          <List
            style={{ paddingTop: '32px', paddingBottom: '50px' }}
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

        {songs.length === 1 ? (
          <>
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
              block
            >
              POST
            </Button>
          </>
        ) : (
          ''
        )}
      </Col>
    </>
  )
}
