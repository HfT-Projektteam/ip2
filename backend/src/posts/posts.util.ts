import { SelectQueryBuilder } from 'typeorm'
import { Post } from './entities/post.entity'
import { PostFilterQuery, PostSort } from './entities/post-query.entity'

export function addFilterToQuery(
  postQuery: SelectQueryBuilder<Post>,
  filterQueryParams: PostFilterQuery,
): SelectQueryBuilder<Post> {
  if (filterQueryParams.genre) {
    postQuery.where('post.genre IN (:...genre)', {
      genre: filterQueryParams.genre.split(','),
    })
  }

  if (filterQueryParams.sort) {
    switch (filterQueryParams.sort) {
      case PostSort.likes:
        postQuery.orderBy('likes', 'ASC')
        break
      case PostSort.dislikes:
        postQuery.orderBy('dislikes', 'ASC')
        break
      case PostSort.newest:
        postQuery.orderBy('post.uploaded', 'DESC')
        break
      case PostSort.oldest:
        postQuery.orderBy('post.uploaded', 'ASC')
        break
    }
  }

  if (filterQueryParams.followerFeed) {
    // TODO, set where with users the other follows
  }

  return postQuery
}
