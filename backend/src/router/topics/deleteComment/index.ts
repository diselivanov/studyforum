import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zDeleteCommentTrpcInput } from './input'

export const deleteCommentTrpcRoute = trpcLoggedProcedure
  .input(zDeleteCommentTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    const comment = await ctx.prisma.comment.findUnique({
      where: { id: input.commentId },
      include: {
        replies: {
          where: {
            deletedAt: null,
          },
        },
      },
    })

    if (!comment) {
      throw Error('COMMENT_NOT_FOUND')
    }

    // Проверяем, что пользователь является автором комментария
    if (comment.authorId !== ctx.me.id) {
      throw Error('FORBIDDEN')
    }

    // Мягкое удаление комментария и всех его ответов
    await ctx.prisma.comment.updateMany({
      where: {
        OR: [{ id: input.commentId }, { parentId: input.commentId }],
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return { success: true }
  })
