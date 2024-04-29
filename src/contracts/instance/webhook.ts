import { z } from 'zod'

import { appErrorSchema } from '@/contracts/AppError'
import { apiAndNameSchema, instanceNameSchema } from '@/contracts/EvoSDK'

export const webhookEventsSchema = z.enum([
  'APPLICATION_STARTUP',
  'QRCODE_UPDATED',
  'MESSAGES_SET',
  'MESSAGES_UPSERT',
  'MESSAGES_UPDATE',
  'MESSAGES_DELETE',
  'SEND_MESSAGE',
  'CONTACTS_SET',
  'CONTACTS_UPSERT',
  'CONTACTS_UPDATE',
  'PRESENCE_UPDATE',
  'CHATS_SET',
  'CHATS_UPSERT',
  'CHATS_UPDATE',
  'CHATS_DELETE',
  'GROUPS_UPSERT',
  'GROUP_UPDATE',
  'GROUP_PARTICIPANTS_UPDATE',
  'CONNECTION_UPDATE',
  'CALL',
  'NEW_JWT_TOKEN',
  'TYPEBOT_START',
  'TYPEBOT_CHANGE_STATUS',
  'LABELS_EDIT',
  'LABELS_ASSOCIATION',
])

export const webhookSchemaRequest = z
  .object({
    enabled: z.boolean().optional().default(true),
    url: z.string().url().optional(),
    events: z.array(webhookEventsSchema).nonempty().optional(),
    byEvents: z.boolean().optional().default(false),
    base64: z.boolean().optional().default(false),
  })
  .refine(
    (data) => {
      if (data.enabled === true) {
        return data.url !== undefined && data.events !== undefined
      }
      return true
    },
    { message: 'Url and events are required when enabled' },
  )
export type WebhookSchemaRequest = z.input<typeof webhookSchemaRequest>

export const setWebhookRequest = webhookSchemaRequest.and(apiAndNameSchema)
export type SetWebhookRequest = z.input<typeof setWebhookRequest>
export const setWebhookResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    instanceName: instanceNameSchema,
    webhook: webhookSchemaRequest,
  }),
])
export type SetWebhookResponse = z.infer<typeof setWebhookResponse>
