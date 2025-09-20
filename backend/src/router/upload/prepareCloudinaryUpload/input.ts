import { cloudinaryUploadTypes } from '@studyforum/shared/src/cloudinary'
import { getKeysAsArray } from '@studyforum/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
