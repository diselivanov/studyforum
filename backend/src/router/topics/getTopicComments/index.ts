import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zGetTopicCommentsTrpcInput } from './input'

export const getTopicCommentsTrpcRoute = trpcLoggedProcedure
  .input(zGetTopicCommentsTrpcInput)
  .query(async ({ input, ctx }) => {
    const { topicId, page = 1, limit = 20 } = input

    // Проверяем существование темы
    const topic = await ctx.prisma.topic.findUnique({
      where: { id: topicId },
    })

    if (!topic) {
      throw Error('TOPIC_NOT_FOUND')
    }

    const skip = (page - 1) * limit

    const [comments, totalCount] = await Promise.all([
      ctx.prisma.comment.findMany({
        where: {
          topicId,
          parentId: null, // Только корневые комментарии
          deletedAt: null, // Только неудаленные
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          commentLikes: {
            select: {
              userId: true,
            },
          },
          replies: {
            where: {
              deletedAt: null,
            },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
              commentLikes: {
                select: {
                  userId: true,
                },
              },
            },
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
      }),
      ctx.prisma.comment.count({
        where: {
          topicId,
          parentId: null,
          deletedAt: null,
        },
      }),
    ])

    // Добавляем информацию о лайках текущего пользователя
    const commentsWithLikes = comments.map((comment) => ({
      ...comment,
      likedByMe: ctx.me ? comment.commentLikes.some((like) => like.userId === ctx.me!.id) : false,
      likesCount: comment.commentLikes.length,
      replies: comment.replies.map((reply) => ({
        ...reply,
        likedByMe: ctx.me ? reply.commentLikes.some((like) => like.userId === ctx.me!.id) : false,
        likesCount: reply.commentLikes.length,
      })),
    }))

    return {
      comments: commentsWithLikes,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  })
