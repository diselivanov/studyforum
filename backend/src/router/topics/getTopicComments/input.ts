import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zGetTopicCommentsTrpcInput = z.object({
  topicId: zStringRequired,
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})
