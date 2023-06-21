import { Repository, SelectQueryBuilder } from 'typeorm'
import { Post } from './entities/post.entity'
import { PostFilterQuery, PostSort } from './entities/post-query.entity'

export function addFilterToQuery(
  postQuery: SelectQueryBuilder<Post>,
  filterQueryParams: PostFilterQuery,
): SelectQueryBuilder<Post> {
  if (filterQueryParams.genre) {
    postQuery.where('posts.genre IN (:...genre)', {
      genre: filterQueryParams.genre.split(','),
    })
  }

  if (filterQueryParams.sort) {
    switch (filterQueryParams.sort) {
      case PostSort.likes:
        postQuery.orderBy('posts.likes', 'ASC')
        break
      case PostSort.dislikes:
        postQuery.orderBy('posts.dislikes', 'ASC')
        break
      case PostSort.newest:
        postQuery.orderBy('posts.uploaded', 'DESC')
        break
      case PostSort.oldest:
        postQuery.orderBy('posts.uploaded', 'ASC')
        break
    }
  }

  return postQuery
}
