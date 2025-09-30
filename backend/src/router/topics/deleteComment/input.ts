import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zDeleteCommentTrpcInput = z.object({
  commentId: zStringRequired,
})
