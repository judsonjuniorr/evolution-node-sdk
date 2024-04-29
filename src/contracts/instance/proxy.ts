import { z } from 'zod'

import { appErrorSchema } from '@/contracts/AppError'
import { apiAndNameSchema } from '@/contracts/EvoSDK'

export const proxySchemaRequest = z.object({
  host: z.union([z.string().ip(), z.string()]),
  port: z.coerce
    .number()
    .min(0)
    .max(65353)
    .transform((port) => port.toString()),
  protocol: z.enum(['http', 'https', 'socks', 'socks4', 'socks5']),
  username: z.string().optional(),
  password: z.string().optional(),
})

export const setProxyRequest = apiAndNameSchema.and(
  z.union([
    z.object({
      enabled: z.literal(true),
      proxy: proxySchemaRequest,
    }),
    z.object({ enabled: z.literal(false) }),
  ]),
)
export type SetProxyRequest = z.input<typeof setProxyRequest>
export const setProxyResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    enabled: z.boolean(),
    proxy: proxySchemaRequest.nullable(),
  }),
])
export type SetProxyResponse = z.infer<typeof setProxyResponse>
