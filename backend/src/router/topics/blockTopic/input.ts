import { zIdRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zBlockTopicTrpcInput = z.object({
  topicId: zIdRequired,
})
