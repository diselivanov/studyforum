import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zGetUserTrpcInput = z.object({
  selectedUser: zStringRequired,
})
