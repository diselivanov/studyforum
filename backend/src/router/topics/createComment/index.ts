import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zCreateCommentTrpcInput } from './input'

export const createCommentTrpcRoute = trpcLoggedProcedure
  .input(zCreateCommentTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    // Проверяем существование темы
    const topic = await ctx.prisma.topic.findUnique({
      where: { id: input.topicId },
    })

    if (!topic) {
      throw Error('TOPIC_NOT_FOUND')
    }

    // Если это ответ, проверяем существование родительского комментария
    if (input.parentId) {
      const parentComment = await ctx.prisma.comment.findUnique({
        where: { id: input.parentId },
      })

      if (!parentComment) {
        throw Error('PARENT_COMMENT_NOT_FOUND')
      }
    }

    const comment = await ctx.prisma.comment.create({
      data: {
        content: input.content,
        topicId: input.topicId,
        authorId: ctx.me.id,
        parentId: input.parentId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            commentLikes: true,
            replies: true,
          },
        },
      },
    })

    return comment
  })
