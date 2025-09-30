import type { TrpcRouterOutput } from '@studyforum/backend/src/router'
import { canBlockTopics, canEditTopic } from '@studyforum/backend/src/utils/can'
import { getAvatarUrl, getCloudinaryUploadUrl } from '@studyforum/shared/src/cloudinary'
import format from 'date-fns/format'
import { useState } from 'react'
import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Icon } from '../../../components/Icon'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditTopicRoute, getViewTopicRoute, getViewUserRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import css from './index.module.scss'
import { ru } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import EmojiPicker, { Theme } from 'emoji-picker-react';

const LikeButton = ({ topic }: { topic: NonNullable<TrpcRouterOutput['getTopic']['topic']> }) => {
  const trpcUtils = trpc.useContext()
  const setTopicLike = trpc.setTopicLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetAdData = trpcUtils.getTopic.getData({ selectedTopic: topic.id })
      if (oldGetAdData?.topic) {
        const newGetAdData = {
          ...oldGetAdData,
          topic: {
            ...oldGetAdData.topic,
            isLikedByMe,
            likesCount: oldGetAdData.topic.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getTopic.setData({ selectedTopic: topic.id }, newGetAdData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getTopic.invalidate({ selectedTopic: topic.id })
    },
  })
  return (
    <button
      className={css.likeButton}
      onClick={() => {
        void setTopicLike.mutateAsync({ topicId: topic.id, isLikedByMe: !topic.isLikedByMe })
      }}
    >
      <Icon size={20} className={css.likeIcon} name={topic.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
      <span className={css.likeCount}>{topic.likesCount}</span>
    </button>
  )
}

const CommentLikeButton = ({ comment }: { comment: any }) => {
  const trpcUtils = trpc.useContext()
  const toggleCommentLike = trpc.toggleCommentLike.useMutation({
    onMutate: () => {
      const oldData = trpcUtils.getTopicComments.getData({ topicId: comment.topicId })
      if (oldData) {
        const updatedComments = oldData.comments.map((c) => {
          if (c.id === comment.id) {
            return {
              ...c,
              likedByMe: !c.likedByMe,
              likesCount: c.likesCount + (c.likedByMe ? -1 : 1),
            }
          }
          const updatedReplies = c.replies.map((reply) => {
            if (reply.id === comment.id) {
              return {
                ...reply,
                likedByMe: !reply.likedByMe,
                likesCount: reply.likesCount + (reply.likedByMe ? -1 : 1),
              }
            }
            return reply
          })
          return { ...c, replies: updatedReplies }
        })
        trpcUtils.getTopicComments.setData(
          { topicId: comment.topicId },
          {
            ...oldData,
            comments: updatedComments,
          }
        )
      }
    },
    onSuccess: () => {
      void trpcUtils.getTopicComments.invalidate({ topicId: comment.topicId })
    },
  })

  return (
    <button
      className={`${css.commentLikeButton} ${comment.likedByMe ? css.liked : ''}`}
      onClick={() => {
        void toggleCommentLike.mutateAsync({ commentId: comment.id })
      }}
      disabled={toggleCommentLike.isLoading}
    >
      <Icon size={16} name={comment.likedByMe ? 'likeFilled' : 'likeEmpty'} />
      <span>{comment.likesCount}</span>
    </button>
  )
}

const CommentItem = ({
  comment,
  topicId,
  onReply,
}: {
  comment: any
  topicId: string
  onReply: (comment: any) => void
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const trpcUtils = trpc.useContext()

  const createComment = trpc.createComment.useMutation({
    onSuccess: () => {
      setReplyContent('')
      setShowReplyForm(false)
      void trpcUtils.getTopicComments.invalidate({ topicId })
    },
  })
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    void createComment.mutateAsync({
      topicId,
      content: replyContent,
      parentId: comment.id,
    })
  }

  // Проверяем, является ли комментарий ответом (реплаем)
  const isReply = !!comment.parentId

  return (
    <div className={`${css.comment} ${isReply ? css.reply : ''}`}>
      <div className={css.commentHeader}>
        <img className={css.commentAvatar} alt="" src={getAvatarUrl(comment.author.avatar, 'small')} />
        <div className={css.commentAuthorInfo}>
          <Link className={css.commentAuthorName} to={getViewUserRoute({ selectedUser: comment.author.id })}>
            {comment.author.name}
          </Link>
          <span className={css.commentDate}>{format(comment.createdAt, 'd MMM в HH:mm', { locale: ru })}</span>
        </div>
      </div>

      <div className={css.commentContent}>{comment.content}</div>

      <div className={css.commentActions}>
        <CommentLikeButton comment={comment} />
        {/* Скрываем кнопку "Ответить" для ответов */}
        {!isReply && (
          <button
            className={css.commentActionButton}
            onClick={() => {
              setShowReplyForm(!showReplyForm)
              onReply(comment)
            }}
          >
            Ответить
          </button>
        )}
      </div>

      {showReplyForm && (
        <form className={css.replyForm} onSubmit={handleSubmitReply}>
          <input
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Напишите ответ..."
            className={css.replyTextarea}
          />
          <div className={css.replyActions}>
            <Button type="submit" disabled={createComment.isLoading || !replyContent.trim()}>
              {createComment.isLoading ? 'Отправка...' : 'Отправить'}
            </Button>
            <Button type="button" onClick={() => setShowReplyForm(false)}>
              Отмена
            </Button>
          </div>
        </form>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className={css.replies}>
          {comment.replies.map((reply: any) => (
            <CommentItem key={reply.id} comment={reply} topicId={topicId} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  )
}

const CommentsSection = ({ topicId }: { topicId: string }) => {
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<any>(null)
  const trpcUtils = trpc.useContext()

  const { data: commentsData, isLoading } = trpc.getTopicComments.useQuery({ topicId }, { enabled: !!topicId })

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    setNewComment(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const createComment = trpc.createComment.useMutation({
    onSuccess: () => {
      setNewComment('')
      setReplyingTo(null)
      void trpcUtils.getTopicComments.invalidate({ topicId })
    },
  })

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    void createComment.mutateAsync({
      topicId,
      content: newComment,
      parentId: replyingTo?.id,
    })
  }

  const handleReply = (comment: any) => {
    setReplyingTo(comment)
    setNewComment('')
  }

  const cancelReply = () => {
    setReplyingTo(null)
  }

  if (isLoading) {
    return <div className={css.commentsLoading}>Загрузка комментариев...</div>
  }

  return (
    <div className={css.commentsSection}>
      <h3 className={css.commentsTitle}>Комментарии {commentsData && `(${commentsData.totalCount})`}</h3>

      <form className={css.newCommentForm} onSubmit={handleSubmitComment}>
        {replyingTo && (
          <div className={css.replyingTo}>
            <span>Ответ для {replyingTo.author.name}</span>
            <button type="button" onClick={cancelReply}>
              ×
            </button>
          </div>
        )}
        <div className={css.inputContainer}>
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyingTo ? 'Напишите ответ...' : 'Напишите комментарий...'}
          className={css.commentTextarea}
        />
      </div>

      <button 
          type="button" 
          className={css.emojiButton}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          😊
        </button>
        
        {showEmojiPicker && (
          <div className={css.emojiPicker}>
            <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK}  />
          </div>
        )}

        <div className={css.commentSubmit}>
          <Button type="submit" disabled={createComment.isLoading || !newComment.trim()}>
            {createComment.isLoading ? 'Отправка...' : 'Отправить'}
          </Button>
        </div>
      </form>

      <div className={css.commentsList}>
        {commentsData?.comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} topicId={topicId} onReply={handleReply} />
        ))}

        {commentsData?.comments.length === 0 && (
          <div className={css.noComments}>Пока нет комментариев. Будьте первым!</div>
        )}
      </div>

      {commentsData && commentsData.totalPages > 1 && (
        <div className={css.commentsPagination}>
          <button disabled={commentsData.currentPage === 1}>Назад</button>
          <span>
            Страница {commentsData.currentPage} из {commentsData.totalPages}
          </span>
          <button disabled={commentsData.currentPage === commentsData.totalPages}>Вперед</button>
        </div>
      )}
    </div>
  )
}

const ImageGallery = ({ images }: { images: string[] }) => {
  const [selectedImage, setSelectedImage] = useState(0)

  if (images.length === 0) return null

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className={css.gallery}>
      <div className={css.mainImage}>
        <img src={getCloudinaryUploadUrl(images[selectedImage], 'image', 'large')} alt={`Image ${selectedImage + 1}`} />
        {images.length > 1 && (
          <>
            <button className={`${css.navButton} ${css.navButtonPrev}`} onClick={prevImage}>
              <Icon name="arrowLeft" size={20} />
            </button>
            <button className={`${css.navButton} ${css.navButtonNext}`} onClick={nextImage}>
              <Icon name="arrowRight" size={20} />
            </button>
          </>
        )}
        {images.length > 1 && (
          <div className={css.imageCounter}>
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className={css.thumbnails}>
          {images.map((image, index) => (
            <button
              key={image}
              className={`${css.thumbnail} ${index === selectedImage ? css.active : ''}`}
              onClick={() => setSelectedImage(index)}
            >
              <img src={getCloudinaryUploadUrl(image, 'image', 'preview')} alt={`Thumbnail ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const BlockTopic = ({ topic }: { topic: NonNullable<TrpcRouterOutput['getTopic']['topic']> }) => {
  const blockTopic = trpc.blockTopic.useMutation()
  const trpcUtils = trpc.useContext()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockTopic.mutateAsync({ topicId: topic.id })
      await trpcUtils.getTopic.refetch({ selectedTopic: topic.id })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Заблокировать тему
        </Button>
      </FormItems>
    </form>
  )
}

export const ViewTopicPage = withPageWrapper({
  useQuery: () => {
    const { selectedTopic } = getViewTopicRoute.useParams()
    return trpc.getTopic.useQuery({
      selectedTopic,
    })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    topic: checkExists(queryResult.data.topic, 'Topic not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ topic }) => topic.title,
})(({ topic, me }) => {
  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.meta}>
          <h1 className={css.title}>
            <div>{topic.title}</div>
            {me && <LikeButton topic={topic} />}
          </h1>
          <div className={css.tags}>
            <span className={css.discipline}>{topic.discipline}</span>
            <span className={css.teacher}>{topic.teacher}</span>
          </div>
        </div>
      </div>

      <div className={css.content}>
        <div className={css.galleryColumn}>
          <ImageGallery images={topic.images} />
        </div>

        <div className={css.detailsColumn}>
          <div className={css.author}>
            <img className={css.avatar} alt="" src={getAvatarUrl(topic.author.avatar, 'small')} />
            <div className={css.authorInfo}>
              <Link className={css.authorName} to={getViewUserRoute({ selectedUser: topic.author.id })}>
                {topic.author.name}
              </Link>
              <span className={css.date}>{format(topic.createdAt, 'd MMM в HH:mm', { locale: ru })}</span>
            </div>
          </div>

          <div className={css.details}>
            <div className={css.detailItem}>
              <p className={css.description}>{topic.description}</p>
            </div>
          </div>

          <div className={css.actions}>
            {canEditTopic(me, topic) && (
              <LinkButton to={getEditTopicRoute({ selectedTopic: topic.id })}>Редактировать</LinkButton>
            )}

            {canBlockTopics(me) && <BlockTopic topic={topic} />}
          </div>
        </div>
      </div>

      <CommentsSection topicId={topic.id} />
    </div>
  )
})
