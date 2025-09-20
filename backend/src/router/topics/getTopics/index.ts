import { omit } from '@studyforum/shared/src/omit'
import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetTopicsTrpcInput } from './input'

export const getTopicsTrpcRoute = trpcLoggedProcedure.input(zGetTopicsTrpcInput).query(async ({ ctx, input }) => {
  const normalizedSearch = input.search ? input.search.trim().replace(/[\s\n\t]/g, ' & ') : undefined

  const rawTopics = await ctx.prisma.topic.findMany({
    select: {
      id: true,
      serialNumber: true,
      title: true,
      description: true,
      discipline: true,
      teacher: true,
      images: true,
      createdAt: true,
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

    where: {
      blockedAt: null,

      // Добавляем фильтрацию по дисциплине
      ...(input.discipline ? { discipline: input.discipline } : {}),
      
      // Добавляем фильтрацию по преподавателю
      ...(input.teacher ? { teacher: input.teacher } : {}),

      // Поиск по title и description
      ...(!normalizedSearch
        ? {}
        : {
            OR: [
              {
                title: {
                  search: normalizedSearch,
                },
              },
              {
                description: {
                  search: normalizedSearch,
                },
              },
            ],
          }),
    },

    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],

    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })

  const nextTopic = rawTopics.at(input.limit)
  const nextCursor = nextTopic?.serialNumber

  // Преобразуем rawTopics, добавляя isLikedByMe и likesCount
  const topics = rawTopics.slice(0, input.limit).map((rawTopic) => {
    const isLikedByMe = !!rawTopic?.topicsLikes.length
    const likesCount = rawTopic?._count.topicsLikes || 0
    return { ...omit(rawTopic, ['topicsLikes', '_count']), isLikedByMe, likesCount }
  })

  return { topics, nextCursor }
})