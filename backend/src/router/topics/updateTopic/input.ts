import { zIdRequired } from '@studyforum/shared/src/zod'
import { zCreateTopicTrpcInput } from '../createTopic/input'

export const zUpdateTopicTrpcInput = zCreateTopicTrpcInput.extend({
  topicId: zIdRequired,
})
