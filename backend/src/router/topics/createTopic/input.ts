import { zIdRequired, zPriceRequired, zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zCreateTopicTrpcInput = z.object({
  title: zStringRequired,
  description: zStringRequired,
  discipline: zStringRequired,
  teacher: zStringRequired,
  images: z.array(zStringRequired),
})
