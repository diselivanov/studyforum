import { pick } from '@studyforum/shared/src/pick'
import { type User } from '@prisma/client'

export const toClientMe = (user: User | null) => {
  return (
    user &&
    pick(user, [
      'id',
      'name',
      'email',
      'description',
      'phone',
      'age',
      'form',
      'faculty',
      'direction',
      'number',
      'group',
      'year',
      'avatar',
      'permissions',
      'createdAt',
    ])
  )
}
