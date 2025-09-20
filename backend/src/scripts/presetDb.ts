import { env } from '../lib/env'
import { type AppContext } from '../lib/ctx'
import { getPasswordHash } from '../utils/getPasswordHash'

export const presetDb = async (ctx: AppContext) => {
  // Создание админ аккаунта
  await ctx.prisma.user.upsert({
    where: {
      email: 'admin@example.com',
    },
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: getPasswordHash(env.INITIAL_ADMIN_PASSWORD),
      permissions: ['ALL'],
    },
    update: {
      permissions: ['ALL'],
    },
  })
  console.log('Админ аккаунт создан/обновлен')
}
