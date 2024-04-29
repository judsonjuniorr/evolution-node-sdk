import { PhoneNumberValidator } from '@/utils/phone'
import { z } from 'zod'

import { appErrorSchema } from '@/contracts/AppError'
import { apiAndNameSchema } from '@/contracts/EvoSDK'

/**
 * Fetch business profile request schema
 */
export const fetchBusinessProfileRequest = z
  .object({
    number: z
      .string()
      .refine(
        (value) => {
          if (!value) return true
          return PhoneNumberValidator.validateAndFormat(value)
        },
        { message: 'Invalid phone number' },
      )
      .transform((value) => value.replace(/[^0-9]/g, '')),
  })
  .and(apiAndNameSchema)
export type FetchBusinessProfileRequest = z.input<
  typeof fetchBusinessProfileRequest
>
export const fetchBusinessProfileResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    isBusiness: z.boolean(),
    jid: z.string(),
    description: z.string().optional(),
    address: z.string().optional(),
    website: z.array(z.string().url()).optional(),
    email: z.string().email().optional(),
    category: z.string(),
    business_hours: z.object({
      timezone: z.string().optional(),
      business_config: z
        .array(
          z.object({
            day_of_week: z.string(),
            mode: z.string(),
            open_time: z.string(),
            close_time: z.string(),
          }),
        )
        .optional(),
    }),
  }),
])
export type FetchBusinessProfileResponse = z.input<
  typeof fetchBusinessProfileResponse
>
// END Fetch business profile request schema

/**
 * Fetch profile request schema
 */
export const fetchProfileRequest = fetchBusinessProfileRequest
export type FetchProfileRequest = z.input<typeof fetchProfileRequest>
export const fetchProfileResponse = z.union([
  appErrorSchema,
  z.object({
    status: z.literal('success'),
    isBusiness: z.boolean(),
    name: z.string(),
    numberExists: z.boolean(),
    jid: z.string(),
    description: z.string().optional(),
    picture: z.string().url().optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }),
])
export type FetchProfileResponse = z.input<typeof fetchProfileResponse>
// END Fetch profile request schema

/**
 * Privacy settings request schema
 */
const privacyOption = z.enum(['all', 'none', 'contacts', 'contact_blacklist'])
export const privacySettingsResponse = z.union([
  appErrorSchema,
  z.object({
    readreceipts: z.enum(['all', 'none']),
    profile: privacyOption,
    status: privacyOption,
    online: z.enum(['all', 'match_last_seen']),
    last: privacyOption,
    groupadd: z.enum(['all', 'contacts', 'contact_blacklist']),
  }),
])
export type PrivacySettingsResponse = z.input<typeof privacySettingsResponse>
export const updatePrivacySettingsRequest = apiAndNameSchema.and(
  z.object({
    settings: privacySettingsResponse,
  }),
)
export type UpdatePrivacySettingsRequest = z.input<
  typeof updatePrivacySettingsRequest
>
// END Privacy settings request schema

/**
 * Update profile name
 */
export const updateProfileNameRequest = apiAndNameSchema.and(
  z.object({ name: z.string() }),
)
export type UpdateProfileNameRequest = z.input<typeof updateProfileNameRequest>
export const updateProfileNameResponse = z.union([
  appErrorSchema,
  z.object({ status: z.literal('success') }),
])
export type UpdateProfileNameResponse = z.input<
  typeof updateProfileNameResponse
>
