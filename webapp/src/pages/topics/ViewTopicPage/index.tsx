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
import { getEditTopicRoute, getViewTopicRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import css from './index.module.scss'
import { ru } from 'date-fns/locale'

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
        <img
          src={getCloudinaryUploadUrl(images[selectedImage], 'image', 'large')}
          alt={`Image ${selectedImage + 1}`}
        />
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
              <img
                src={getCloudinaryUploadUrl(image, 'image', 'preview')}
                alt={`Thumbnail ${index + 1}`}
              />
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
          <h1 className={css.title}><div>{topic.title}</div>{me && <LikeButton topic={topic} />}</h1>
          <div className={css.row}>
            <span className={css.discipline}>{topic.discipline}</span>
            <span className={css.teacher}>{topic.teacher}</span>
            </div>
        </div>

         <div className={css.author}>
            <img className={css.avatar} alt="" src={getAvatarUrl(topic.author.avatar, 'small')} />
            <div className={css.authorInfo}>
              <p className={css.authorName}>{topic.author.name}</p>
              <span className={css.date}>{format(topic.createdAt, 'd MMM в HH:mm', { locale: ru })}</span>
            </div>
          </div>
      </div>

      <div className={css.content}>
        <div className={css.galleryColumn}>
          <ImageGallery images={topic.images} />
        </div>
        
        <div className={css.detailsColumn}>
          <div className={css.details}>
            <div className={css.detailItem}>
              <span className={css.detailLabel}>Описание:</span>
              <p className={css.description}>{topic.description}</p>
            </div>
          </div>

          <div className={css.actions}>
            
            {canEditTopic(me, topic) && (
              <div className={css.btnSection}>
              <LinkButton to={getEditTopicRoute({ selectedTopic: topic.id })}>
                Редактировать
              </LinkButton>
              </div>
            )}

            {canBlockTopics(me) && (
              <div className={css.btnSection}>
                <BlockTopic topic={topic} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})