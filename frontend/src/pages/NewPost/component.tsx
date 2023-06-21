import {
  getRecentPlayedTracks,
  searchSong,
  searchSongByLink,
} from '@services/SpotifyAPI'
import { Input, Space, Avatar, List, Button, Col, theme } from 'antd'
import { useEffect, useState } from 'react'
import { type components } from '@data/spotify-types'
import TextArea from 'antd/es/input/TextArea'
import useWindowDimensions from '@hooks/useWindowDimensions'
import ScrollToTop from '@services/ScrollToTop'
import { postPost } from '@services/BackendAPI'

const { Search } = Input
type trackObject = components['schemas']['TrackObject']
const { useToken } = theme

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

  const { width } = useWindowDimensions()
  const [containerWidth, setContainerWidth] = useState('100%')

  useEffect(() => {
    width <= 768 ? setContainerWidth('100%') : setContainerWidth('500px')
  }, [width])

  const { token } = useToken()

  return (
    <>
      <span
        style={{
          position: 'fixed',
          width: `${containerWidth}`,
          background: `${token.colorBgLayout}`,
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
          <span
            style={{
              minHeight: '80vh',
              width: `${containerWidth}`,
              background: `${token.colorBgLayout}`,
            }}
          />
        )}

        {songs.length === 1 ? (
          <>
            <ScrollToTop />
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
