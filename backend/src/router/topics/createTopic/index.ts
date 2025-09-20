import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateTopicTrpcInput } from './input'

export const createTopicTrpcRoute = trpcLoggedProcedure.input(zCreateTopicTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  const topic = await ctx.prisma.topic.create({
    data: { ...input, authorId: ctx.me.id },
    select: { id: true },
  })

  return topic
})
