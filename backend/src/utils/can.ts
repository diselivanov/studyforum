import type { Topic, User, UserPermission } from '@prisma/client'

type MaybeUser = Pick<User, 'permissions' | 'id'> | null
type MaybeAd = Pick<Topic, 'authorId'> | null

export const hasPermission = (user: MaybeUser, permission: UserPermission) => {
  return user?.permissions.includes(permission) || user?.permissions.includes('ALL') || false
}

export const canBlockTopics = (user: MaybeUser) => {
  return hasPermission(user, 'BLOCK_TOPICS')
}

export const canEditTopic = (user: MaybeUser, topic: MaybeAd) => {
  return !!user && !!topic && user?.id === topic?.authorId
}
