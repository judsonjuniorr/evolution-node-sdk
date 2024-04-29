import { AxiosInstance, isAxiosError } from 'axios'
import { ZodError } from 'zod'

import { AppError } from '@/contracts/AppError'

export class BaseLibClass {
  constructor(
    protected apiBase: AxiosInstance,
    protected globalApiKey?: string,
  ) {
    this.apiBase = apiBase
    this.globalApiKey = globalApiKey
  }

  protected apiKeyValidator(apiKey?: string) {
    if (!this.globalApiKey && !apiKey) {
      throw new AppError('No API key provided')
    }
  }

  protected getApiKey(apiKey?: string) {
    return apiKey || this.globalApiKey
  }

  protected returnError(error: any) {
    if (error instanceof ZodError) {
      return new AppError(error.format(), 400)
    }

    if (error instanceof AppError) {
      return error
    }

    if (isAxiosError(error)) {
      return new AppError(
        error.response?.data?.response?.message ??
          error.response?.data?.response ??
          error.response?.data,
        error.response?.status,
      )
    }
    return new AppError('An unexpected error occurred', 500)
  }
}
