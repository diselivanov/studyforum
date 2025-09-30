import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zCreateCommentTrpcInput = z.object({
  content: zStringRequired,
  topicId: zStringRequired,
  parentId: z.string().optional(),
})
