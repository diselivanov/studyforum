import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zsetTopicLikeTopicTrpcInput } from './input'

export const setTopicLikeTrpcRoute = trpcLoggedProcedure
  .input(zsetTopicLikeTopicTrpcInput)
  .mutation(async ({ ctx, input }) => {
    const { topicId, isLikedByMe } = input

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

    if (isLikedByMe) {
      await ctx.prisma.topicLike.upsert({
        where: {
          topicId_userId: {
            topicId,
            userId: ctx.me.id,
          },
        },
        create: {
          userId: ctx.me.id,
          topicId,
        },
        update: {},
      })
    } else {
      await ctx.prisma.topicLike.delete({
        where: {
          topicId_userId: {
            topicId,
            userId: ctx.me.id,
          },
        },
      })
    }

    const likesCount = await ctx.prisma.topicLike.count({
      where: {
        topicId,
      },
    })

    return {
      topic: {
        id: topic.id,
        likesCount,
        isLikedByMe,
      },
    }
  })
