import { trpcLoggedProcedure } from '../../../lib/trpc'
import { zToggleCommentLikeTrpcInput } from './input'

export const toggleCommentLikeTrpcRoute = trpcLoggedProcedure
  .input(zToggleCommentLikeTrpcInput)
  .mutation(async ({ input, ctx }) => {
    if (!ctx.me) {
      throw Error('UNAUTHORIZED')
    }

    // Проверяем существование комментария
    const comment = await ctx.prisma.comment.findUnique({
      where: { id: input.commentId },
    })

    if (!comment) {
      throw Error('COMMENT_NOT_FOUND')
    }

    // Проверяем, есть ли уже лайк
    const existingLike = await ctx.prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId: input.commentId,
          userId: ctx.me.id,
        },
      },
    })

    if (existingLike) {
      // Удаляем лайк (анлайк)
      await ctx.prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      })
      return { liked: false }
    } else {
      // Добавляем лайк
      await ctx.prisma.commentLike.create({
        data: {
          commentId: input.commentId,
          userId: ctx.me.id,
        },
      })
      return { liked: true }
    }
  })
