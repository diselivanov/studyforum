import { omit } from '@studyforum/shared/src/omit'
import { ExpectedError } from '../../../lib/error'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetUserTrpcInput } from './input'

export const getUserTrpcRoute = trpcLoggedProcedure.input(zGetUserTrpcInput).query(async ({ ctx, input }) => {
  const rawUser = await ctx.prisma.user.findUnique({
    where: {
      id: input.selectedUser,
    },
    include: {
      topics: {
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10, // Ограничиваем количество топиков для производительности
      },
      topicsLikes: {
        select: {
          id: true,
          topicId: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          topicId: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10, // Ограничиваем количество комментариев
      },
      commentLikes: {
        select: {
          id: true,
          commentId: true,
        },
      },
      _count: {
        select: {
          topics: true,
          topicsLikes: true,
          comments: true,
          commentLikes: true,
        },
      },
    },
  })

  if (!rawUser) {
    throw new ExpectedError('Пользователь не найден')
  }

  // Исключаем пароль из ответа
  const userWithoutPassword = omit(rawUser, ['password'])

  const user = {
    ...userWithoutPassword,
    counts: {
      topics: rawUser._count.topics,
      topicsLikes: rawUser._count.topicsLikes,
      comments: rawUser._count.comments,
      commentLikes: rawUser._count.commentLikes,
    },
  }

  return { user }
})
