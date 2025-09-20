import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canBlockTopics } from '../../../utils/can'
import { zBlockTopicTrpcInput } from './input'

export const blockTopicTrpcRoute = trpcLoggedProcedure.input(zBlockTopicTrpcInput).mutation(async ({ ctx, input }) => {
  const { topicId } = input
  if (!canBlockTopics(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }
  const topic = await ctx.prisma.topic.findUnique({
    where: {
      id: topicId,
    },
  })
  if (!topic) {
    throw new Error('NOT_FOUND')
  }
  await ctx.prisma.topic.update({
    where: {
      id: topicId,
    },
    data: {
      blockedAt: new Date(),
    },
  })
  return true
})
