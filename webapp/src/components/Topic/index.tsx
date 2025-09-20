import React from 'react'
import { format } from 'date-fns'
import type { TrpcRouterOutput } from '@studyforum/backend/src/router'
import css from './index.module.scss'
import { Link } from 'react-router-dom'
import { getViewTopicRoute } from '../../lib/routes'
import { getAvatarUrl } from '@studyforum/shared/src/cloudinary'
import { Icon } from '../Icon'
import { ru } from 'date-fns/locale'

type Topic = TrpcRouterOutput['getTopics']['topics'][number]

interface TopicProps {
  topic: Topic
  className?: string
}

export const Topic: React.FC<TopicProps> = ({ topic, className = '' }) => {
  return (
    <div id={topic.id} className={`${css.Topic} ${className}`}>
      <div className={css.content}>
        <div className={css.meta}>
          {topic.discipline && (
            <span className={css.disciplineBadge}>{topic.discipline}</span>
          )}
          {topic.teacher && (
            <span className={css.teacherBadge}>{topic.teacher}</span>
          )}
        </div>
        <Link className={css.topicTitle} to={getViewTopicRoute({ selectedTopic: topic.id })}>
          {topic.title}
        </Link>
      </div>
      
      <div className={css.info}>        
        <div className={css.author}>
          <img className={css.avatar} alt="" src={getAvatarUrl(topic.author.avatar, 'small')} />
          <div className={css.authorInfo}>
            <div className={css.name}>{topic.author.name}</div>
            <div className={css.createdAt}>{format(topic.createdAt, 'd MMM в HH:mm', { locale: ru })}</div>
          </div>
        </div>

        <div className={css.likes}>
          <Icon name={'likeEmpty'} className={css.likeIcon} />
          <span className={css.likesCount}>{topic.likesCount}</span>
        </div>
      </div>
    </div>
  )
}