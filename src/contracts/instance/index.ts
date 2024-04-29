import { PhoneNumberValidator } from '@/utils/phone'
import { z } from 'zod'

import { appErrorSchema } from '@/contracts/AppError'
import {
  instanceNameSchema,
  instanceStatus,
  integrationSchema,
} from '@/contracts/EvoSDK'
import {
  setSettingsResponse,
  settingsSchemaRequest,
} from '@/contracts/instance/settings'
import {
  setWebhookResponse,
  webhookSchemaRequest,
} from '@/contracts/instance/webhook'

import { proxySchemaRequest, setProxyResponse } from './proxy'

const instanceSchema = z.union([
  z.object({
    instanceName: instanceNameSchema,
    instanceId: z.string(),
    owner: z.string(),
    profileName: z.string(),
    profilePictureUrl: z.string().url().nullable(),
    profileStatus: z.string().nullable(),
    status: z.literal('open'),
    serverUrl: z.string(),
    apikey: z.string(),
    integration: z.object({
      integration: integrationSchema,
      token: z.string(),
      webhook_wa_business: z.string(),
    }),
  }),
  z.object({
    instanceName: instanceNameSchema,
    instanceId: z.string(),
    status: z.enum(['close', 'connecting']),
    serverUrl: z.string(),
    apikey: z.string().optional(),
    integration: z.object({
      integration: integrationSchema,
      token: z.string(),
      webhook_wa_business: z.string(),
    }),
  }),
])

/**
 * Fetch instance types
 */
export const fetchSingleInstancesResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    instance: instanceSchema,
  }),
])
export type FetchSingleInstancesResponse = z.infer<
  typeof fetchSingleInstancesResponse
>
// END Fetch instance types

/**
 * Fetch instance list types
 */
export const fetchInstanceListRequest = z.object({
  globalApiKey: z.string().optional(),
})
export type FetchInstanceListRequest = z.infer<typeof fetchInstanceListRequest>

export const fetchMultipleInstancesResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    instances: z
      .array(
        z.object({
          instance: instanceSchema,
        }),
      )
      .transform((data) => data.map((d) => d.instance)),
  }),
])
export type FetchMultipleInstancesResponse = z.output<
  typeof fetchMultipleInstancesResponse
>
// END Fetch instance list types

/**
 * Instance status types
 */
export const instanceStatusResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    instanceName: z.string(),
    state: instanceStatus,
  }),
])
export type InstanceStatusResponse = z.infer<typeof instanceStatusResponse>
// END Instance status types

/**
 * Instance restart types
 */
export const instanceRestartResponse = instanceStatusResponse
export type InstanceRestartResponse = z.infer<typeof instanceRestartResponse>
// END Instance restart types

/**
 * Instance logout types
 */
export const instanceLogoutResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    statusCode: z.number(),
    message: z.union([z.string(), z.record(z.string(), z.any())]),
  }),
])
export type InstanceLogoutResponse = z.infer<typeof instanceLogoutResponse>
// END Instance logout types

/**
 * Instance logout types
 */
export const instanceDeleteResponse = instanceLogoutResponse
export type InstanceDeleteResponse = z.infer<typeof instanceDeleteResponse>
// END Instance logout types

/**
 * Create instance types
 */
export const createInstanceRequest = z.object({
  instanceName: instanceNameSchema,
  token: z.string().min(1, 'Token is required'),
  qrcode: z.boolean().optional().default(true),
  integration: integrationSchema,
  number: z
    .string()
    .refine(
      (value) => {
        if (!value) return true
        return PhoneNumberValidator.validateAndFormat(value)
      },
      { message: 'Invalid phone number' },
    )
    .transform((value) => value.replace(/[^0-9]/g, ''))
    .optional(),

  webhook: webhookSchemaRequest.optional(),
  settings: settingsSchemaRequest.optional(),
  proxy: proxySchemaRequest.optional(),
})
export type CreateInstanceRequest = z.input<typeof createInstanceRequest>
export const createInstanceResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    instance: z.object({
      instanceName: instanceNameSchema,
      instanceId: z.string(),
      integration: integrationSchema,
      webhook_wa_business: z.string().nullable(),
      access_token_wa_business: z.string().nullable(),
      status: instanceStatus,
    }),
    qrcode: z.object({
      pairingCode: z.string(),
      code: z.string(),
      base64: z.string(),
      count: z.number(),
    }),
    webhook: setWebhookResponse
      .optional()
      .transform((data) =>
        data && data.status === 'success' ? data.webhook : data,
      ),
    settings: setSettingsResponse
      .optional()
      .transform((data) =>
        data && data.status === 'success' ? data.settings : data,
      ),
    proxy: setProxyResponse
      .optional()
      .transform((data) =>
        data && data.status === 'success' ? data.proxy : data,
      ),
  }),
])
export type CreateInstanceResponse = z.infer<typeof createInstanceResponse>
