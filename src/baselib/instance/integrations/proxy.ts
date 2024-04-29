import { ApiAndNameSchema, apiAndNameSchema } from '@/contracts/EvoSDK'
import {
  SetProxyRequest,
  SetProxyResponse,
  setProxyRequest,
  setProxyResponse,
} from '@/contracts/instance/proxy'

import { BaseLibClass } from '@/baselib/BaseLibClass'

export abstract class InstanceProxy extends BaseLibClass {
  public async fetch(params: ApiAndNameSchema): Promise<SetProxyResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.get(
        `/proxy/find/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = setProxyResponse.parse({
        status: 'success',
        enabled: request.data.enabled,
        proxy: request.data.proxy,
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async define(params: SetProxyRequest): Promise<SetProxyResponse> {
    try {
      const paramsParsed = setProxyRequest.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.post(
        `/proxy/set/${paramsParsed.instanceName}`,
        {
          enabled: paramsParsed.enabled,
          proxy: paramsParsed.enabled ? paramsParsed.proxy : {},
        },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      return setProxyResponse.parse({
        ...request.data?.proxy?.proxy,
        status: 'success',
      })
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async remove(params: ApiAndNameSchema): Promise<SetProxyResponse> {
    return this.define({
      enabled: false,
      instanceName: params.instanceName,
      apiKey: params.apiKey,
    })
  }
}

export class BaseInstanceProxy extends InstanceProxy {}
