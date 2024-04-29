import { ApiAndNameSchema, apiAndNameSchema } from '@/contracts/EvoSDK'
import {
  SetWebhookRequest,
  SetWebhookResponse,
  setWebhookResponse,
  setWebhookRequest,
} from '@/contracts/instance/webhook'

import { BaseLibClass } from '@/baselib/BaseLibClass'

export abstract class InstanceWebhook extends BaseLibClass {
  public async fetch(params: ApiAndNameSchema): Promise<SetWebhookResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.get(
        `/webhook/find/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = setWebhookResponse.parse({
        status: 'success',
        instanceName: paramsParsed.instanceName,
        webhook: {
          url: request.data?.url,
          events: request.data?.events,
          byEvents: request.data?.webhook_by_events,
          base64: request.data?.webhook_base64,
          enabled: request.data?.enabled,
        },
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async define(params: SetWebhookRequest): Promise<SetWebhookResponse> {
    try {
      const paramsParsed = setWebhookRequest.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.post(
        `/webhook/set/${paramsParsed.instanceName}`,
        {
          enabled: paramsParsed.enabled,
          url: paramsParsed.url,
          webhook_by_events: paramsParsed.byEvents,
          webhook_base64: paramsParsed.base64,
          events: params.events,
        },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = setWebhookResponse.parse({
        status: 'success',
        instanceName: paramsParsed.instanceName,
        webhook: {
          url: request.data?.webhook?.webhook?.url,
          events: request.data?.webhook?.webhook?.events,
          byEvents: request.data?.webhook?.webhook?.webhook_by_events,
          base64: request.data?.webhook?.webhook?.webhook_base64,
          enabled: request.data?.webhook?.webhook?.enabled,
        },
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async remove(params: ApiAndNameSchema): Promise<SetWebhookResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      return this.define({
        instanceName: paramsParsed.instanceName,
        apiKey: paramsParsed.apiKey,
        enabled: false,
      })
    } catch (error) {
      return this.returnError(error)
    }
  }
}

export class BaseInstanceWebhook extends InstanceWebhook {}
