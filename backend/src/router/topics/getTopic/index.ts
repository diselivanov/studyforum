import { omit } from '@studyforum/shared/src/omit'
import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetTopicTrpcInput } from './input'

export const getTopicTrpcRoute = trpcLoggedProcedure.input(zGetTopicTrpcInput).query(async ({ ctx, input }) => {
  const rawTopic = await ctx.prisma.topic.findUnique({
    where: {
      id: input.selectedTopic,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          phone: true,
          avatar: true,
        },
      },

      topicsLikes: {
        select: {
          id: true,
        },
        where: {
          userId: ctx.me?.id,
        },
      },
      _count: {
        select: {
          topicsLikes: true,
        },
      },
    },
  })

  if (rawTopic?.blockedAt) {
    throw new ExpectedError('Тема заблокирована')
  }

  const isLikedByMe = !!rawTopic?.topicsLikes.length
  const likesCount = rawTopic?._count.topicsLikes || 0
  const topic = rawTopic && { ...omit(rawTopic, ['topicsLikes', '_count']), isLikedByMe, likesCount }

  return { topic }
})
