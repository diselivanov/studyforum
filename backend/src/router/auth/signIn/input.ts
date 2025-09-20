import { zStringRequired, zEmailRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zSignInTrpcInput = z.object({
  email: zEmailRequired,
  password: zStringRequired,
})
