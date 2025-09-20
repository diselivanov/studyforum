import { zStringRequired } from '@studyforum/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  name: zStringRequired,
  description: zStringRequired,
  phone: zStringRequired,
  age: zStringRequired,
  form: zStringRequired,
  faculty: zStringRequired,
  direction: zStringRequired,
  number: zStringRequired,
  group: zStringRequired,
  year: zStringRequired,
  avatar: z.string().nullable(),
})
