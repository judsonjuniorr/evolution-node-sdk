import { z } from 'zod'

import { appErrorSchema } from '@/contracts/AppError'
import { apiAndNameSchema, instanceNameSchema } from '@/contracts/EvoSDK'

export const settingsSchemaRequest = z.object({
  rejectCalls: z.boolean().optional().default(true),
  rejectCallsMessage: z.string().optional(),
  groupsIgnore: z.boolean().optional().default(true),
  alwaysOnline: z.boolean().optional().default(false),
  readMessages: z.boolean().optional().default(true),
  readStatus: z.boolean().optional().default(true),
  syncFullHistory: z.boolean().optional().default(false),
})

export const setSettingsRequest = settingsSchemaRequest.and(apiAndNameSchema)
export type SetSettingsRequest = z.infer<typeof setSettingsRequest>
export const setSettingsResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    instanceName: instanceNameSchema,
    settings: settingsSchemaRequest,
  }),
])
export type SetSettingsResponse = z.infer<typeof setSettingsResponse>
