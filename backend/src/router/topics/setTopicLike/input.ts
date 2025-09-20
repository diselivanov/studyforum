import { zIdRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zsetTopicLikeTopicTrpcInput = z.object({
  topicId: zIdRequired,
  isLikedByMe: z.boolean(),
})
