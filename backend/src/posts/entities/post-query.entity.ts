export class PostQuery {
  genre: string;
  followerFeed: boolean;
  sort: PostSort;
}

export enum PostSort {
  likes,
  dislikes,
  newest,
  oldest,
}
