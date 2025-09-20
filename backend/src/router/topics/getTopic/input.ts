import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zGetTopicTrpcInput = z.object({
  selectedTopic: zStringRequired,
})
