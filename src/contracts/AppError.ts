import { z } from 'zod'

export const appErrorSchema = z.object({
  status: z.literal('error'),
  message: z.union([z.string(), z.record(z.string(), z.any())]),
  statusCode: z.number(),
})
type AppErrorSchema = z.infer<typeof appErrorSchema>

export class AppError {
  public readonly status: 'error'

  public readonly message: AppErrorSchema['message']

  public readonly statusCode: number

  constructor(message: AppErrorSchema['message'], statusCode = 400) {
    this.status = 'error'
    this.message = message
    this.statusCode = statusCode
  }
}
