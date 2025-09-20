import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import { createTrpcRouter } from '../lib/trpc'
// @index('./**/index.ts', f => `import { ${f.path.split('/').slice(0, -1).pop()}TrpcRoute } from '${f.path.split('/').slice(0, -1).join('/')}'`)
import { getMeTrpcRoute } from './auth/getMe'
import { signInTrpcRoute } from './auth/signIn'
import { signUpTrpcRoute } from './auth/signUp'
import { updatePasswordTrpcRoute } from './auth/updatePassword'
import { updateProfileTrpcRoute } from './auth/updateProfile'
import { blockTopicTrpcRoute } from './topics/blockTopic'
import { createTopicTrpcRoute } from './topics/createTopic'
import { getTopicTrpcRoute } from './topics/getTopic'
import { getTopicsTrpcRoute } from './topics/getTopics'
import { setTopicLikeTrpcRoute } from './topics/setTopicLike'
import { updateTopicTrpcRoute } from './topics/updateTopic'
import { prepareCloudinaryUploadTrpcRoute } from './upload/prepareCloudinaryUpload'
// @endindex

export const trpcRouter = createTrpcRouter({
  // @index('./**/index.ts', f => `${f.path.split('/').slice(0, -1).pop()}: ${f.path.split('/').slice(0, -1).pop()}TrpcRoute,`)
  getMe: getMeTrpcRoute,
  signIn: signInTrpcRoute,
  signUp: signUpTrpcRoute,
  updatePassword: updatePasswordTrpcRoute,
  updateProfile: updateProfileTrpcRoute,
  blockTopic: blockTopicTrpcRoute,
  createTopic: createTopicTrpcRoute,
  getTopic: getTopicTrpcRoute,
  getTopics: getTopicsTrpcRoute,
  setTopicLike: setTopicLikeTrpcRoute,
  updateTopic: updateTopicTrpcRoute,
  prepareCloudinaryUpload: prepareCloudinaryUploadTrpcRoute,
  // @endindex
})

export type TrpcRouter = typeof trpcRouter
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>
