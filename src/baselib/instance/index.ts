import { AxiosInstance } from 'axios'

import { AppError } from '@/contracts/AppError'
import { ApiAndNameSchema, apiAndNameSchema } from '@/contracts/EvoSDK'
import {
  CreateInstanceRequest,
  CreateInstanceResponse,
  FetchInstanceListRequest,
  FetchMultipleInstancesResponse,
  FetchSingleInstancesResponse,
  InstanceDeleteResponse,
  InstanceLogoutResponse,
  InstanceRestartResponse,
  InstanceStatusResponse,
  createInstanceRequest,
  createInstanceResponse,
  fetchInstanceListRequest,
  fetchMultipleInstancesResponse,
  fetchSingleInstancesResponse,
  instanceDeleteResponse,
  instanceLogoutResponse,
  instanceRestartResponse,
  instanceStatusResponse,
} from '@/contracts/instance'

import { BaseLibClass } from '@/baselib/BaseLibClass'

import { BaseInstanceIntegrations, InstanceIntegrations } from './integrations'
import { BaseInstanceSettings, InstanceSettings } from './settings'

export class Instance extends BaseLibClass {
  public settings: InstanceSettings
  public integrations: InstanceIntegrations

  constructor(
    protected apiBase: AxiosInstance,
    protected globalApiKey?: string,
    public settingsClass: typeof InstanceSettings = BaseInstanceSettings,
    public integrationsClass: typeof InstanceIntegrations = BaseInstanceIntegrations,
  ) {
    super(apiBase, globalApiKey)
    this.settings = settingsClass
      ? new (settingsClass as any)(apiBase, globalApiKey)
      : new BaseInstanceSettings(apiBase, globalApiKey)
    this.integrations = integrationsClass
      ? new (integrationsClass as any)(this, apiBase, globalApiKey)
      : new BaseInstanceIntegrations(this, apiBase, globalApiKey)
  }

  public async fetchList(
    params?: FetchInstanceListRequest,
  ): Promise<FetchMultipleInstancesResponse> {
    try {
      const paramsParsed = params ? fetchInstanceListRequest.parse(params) : {}
      if (!this.globalApiKey && !params?.globalApiKey) {
        return new AppError('Global API key is required to fetch all instances')
      }
      const request = await this.apiBase.get(`/instance/fetchInstances`, {
        headers: { apiKey: this.getApiKey(paramsParsed.globalApiKey) },
      })
      const parsedResponse = fetchMultipleInstancesResponse.parse({
        status: 'success',
        instances: request.data,
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async fetch(
    params: ApiAndNameSchema,
  ): Promise<FetchSingleInstancesResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.get(`/instance/fetchInstances`, {
        params: { instanceName: paramsParsed.instanceName },
        headers: { apiKey: this.getApiKey(paramsParsed.apiKey) },
      })
      return fetchSingleInstancesResponse.parse({
        ...request.data,
        status: 'success',
      })
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async status(
    params: ApiAndNameSchema,
  ): Promise<InstanceStatusResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.get(
        `/instance/connectionState/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = instanceStatusResponse.parse({
        ...(request.data?.instance ?? request.data),
        status: 'success',
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async restart(
    params: ApiAndNameSchema,
  ): Promise<InstanceRestartResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.put(
        `/instance/restart/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = instanceRestartResponse.parse({
        ...(request.data?.instance ?? request.data),
        status: 'success',
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async logout(
    params: ApiAndNameSchema,
  ): Promise<InstanceLogoutResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.delete(
        `/instance/logout/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      return instanceLogoutResponse.parse({
        message:
          request.data?.response?.message ??
          request.data.response ??
          request.data,
        status: 'success',
        statusCode: request.status,
      })
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async delete(
    params: ApiAndNameSchema,
  ): Promise<InstanceDeleteResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.delete(
        `/instance/delete/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      return instanceDeleteResponse.parse({
        message:
          request.data?.response?.message ??
          request.data.response ??
          request.data,
        status: 'success',
        statusCode: request.status,
      })
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async create(
    params: CreateInstanceRequest,
  ): Promise<CreateInstanceResponse> {
    if (!this.globalApiKey) {
      return new AppError('Global API key is required to create an instance')
    }

    let requestData: any = {}
    try {
      const { webhook, settings, proxy, ...paramsParsed } =
        createInstanceRequest.parse(params)
      const request = await this.apiBase.post(`/instance/create`, paramsParsed)
      requestData = request.data

      if (webhook) {
        const webhookResponse = await this.integrations.webhook.define({
          instanceName: paramsParsed.instanceName,
          ...webhook,
        })
        requestData.webhook = webhookResponse
      }
      if (settings) {
        const settingsResponse = await this.settings.define({
          instanceName: paramsParsed.instanceName,
          ...settings,
        })
        requestData.settings = settingsResponse
      }
      if (proxy) {
        const proxyResponse = await this.integrations.proxy.define({
          enabled: true,
          instanceName: paramsParsed.instanceName,
          proxy: {
            ...proxy,
            port: Number(proxy.port),
          },
        })
        requestData.proxy = proxyResponse
      }

      return createInstanceResponse.parse({
        ...requestData,
        status: 'success',
      })
    } catch (error) {
      return this.returnError(error)
    }
  }
}
