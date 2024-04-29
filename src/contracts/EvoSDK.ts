/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
import { z } from 'zod'

// Default schemas
export const versionSchema = z
  .enum(['1.7.4'], { invalid_type_error: '❌ Invalid version' })
  .optional()
  .default('1.7.4')
export type EvolutionVersion = z.infer<typeof versionSchema>

export const integrationSchema = z
  .enum(['WHATSAPP-BAILEYS', 'WHATSAPP-BUSINESS'])
  .optional()
  .default('WHATSAPP-BAILEYS')

export const instanceNameSchema = z.string().min(1, 'Instance name is required')
export const instanceStatus = z.enum(['created', 'open', 'connecting', 'close'])

export const apiAndNameSchema = z.object({
  apiKey: z.string().optional(),
  instanceName: instanceNameSchema,
})
export type ApiAndNameSchema = z.infer<typeof apiAndNameSchema>
// END Default schemas

export const EvoSDKConstructorSchema = z.object({
  /**
   * The base URL of the Evolution API
   * @example 'https://api.evolution.com'
   */
  url: z.string().url({ message: '❌ Invalid URL' }),
  /**
   * The global API key to be used for all requests, defined on the .ENV file of Evolution API
   */
  globalApiKey: z.string().optional(),
})
export type EvoSDKConstructor = z.input<typeof EvoSDKConstructorSchema>
