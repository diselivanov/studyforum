import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zToggleCommentLikeTrpcInput = z.object({
  commentId: zStringRequired,
})
