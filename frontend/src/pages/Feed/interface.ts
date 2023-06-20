import { type postInterface } from '@pages/Feed/Post'

export interface feedInterface {
  posts: postInterface[]
}

export interface HandleFeedChange {
  handleFeedChange: (newFeed: feedInterface) => void
}
