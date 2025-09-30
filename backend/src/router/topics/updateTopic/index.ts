import { trpcLoggedProcedure } from '../../../lib/trpc'
import { canEditTopic } from '../../../utils/can'
import { zUpdateTopicTrpcInput } from './input'

export const updateTopicTrpcRoute = trpcLoggedProcedure
  .input(zUpdateTopicTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { topicId, ...adInput } = input

    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }

    const topic = await ctx.prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    })

    if (!topic) {
      throw new Error('NOT_FOUND')
    }

    if (!canEditTopic(ctx.me, topic)) {
      throw new Error('NOT_YOUR_AD')
    }

    await ctx.prisma.topic.update({
      where: {
        id: topicId,
      },
      data: {
        ...adInput,
      },
    })

    return true
  })
