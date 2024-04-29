import { AxiosInstance } from 'axios'

import { AppError } from '@/contracts/AppError'
import { ApiAndNameSchema, apiAndNameSchema } from '@/contracts/EvoSDK'
import {
  FetchBusinessProfileRequest,
  FetchBusinessProfileResponse,
  FetchProfileRequest,
  FetchProfileResponse,
  PrivacySettingsResponse,
  UpdatePrivacySettingsRequest,
  UpdateProfileNameRequest,
  fetchBusinessProfileRequest,
  fetchBusinessProfileResponse,
  fetchProfileRequest,
  fetchProfileResponse,
  privacySettingsResponse,
  updatePrivacySettingsRequest,
  updateProfileNameRequest,
  updateProfileNameResponse,
} from '@/contracts/profile'

import { BaseLibClass } from '@/baselib/BaseLibClass'
import { Instance } from '@/baselib/instance'

export abstract class Profile extends BaseLibClass {
  constructor(
    private instance: Instance,
    protected apiBase: AxiosInstance,
    protected globalApiKey?: string,
  ) {
    super(apiBase, globalApiKey)
    this.instance = instance
  }

  public async fetchBusiness(
    params: FetchBusinessProfileRequest,
  ): Promise<FetchBusinessProfileResponse> {
    const isInstanceConnected = await this.validateInstanceConnected(params)

    if (!isInstanceConnected) {
      return new AppError('Instance not connected')
    }

    try {
      const paramsParsed = fetchBusinessProfileRequest.parse(params)
      const request = await this.apiBase.post(
        `/chat/fetchBusinessProfile/${paramsParsed.instanceName}`,
        { number: paramsParsed.number },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      if (request.data?.isBusiness === false) {
        return new AppError('This number is not a business profile')
      }
      return fetchBusinessProfileResponse.parse({
        ...request.data,
        status: 'success',
        jid: request.data.wid,
      })
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async fetch(
    params: FetchProfileRequest,
  ): Promise<FetchProfileResponse> {
    const isInstanceConnected = await this.validateInstanceConnected(params)

    if (!isInstanceConnected) {
      return new AppError('Instance not connected')
    }

    try {
      const paramsParsed = fetchProfileRequest.parse(params)
      const request = await this.apiBase.post(
        `/chat/fetchProfile/${paramsParsed.instanceName}`,
        { number: paramsParsed.number },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      return fetchProfileResponse.parse({
        ...request.data,
        name: request.data.name ?? request.data.description,
        description: request.data.status,
        status: 'success',
        jid: request.data.wuid,
      })
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async privacySettings(
    params: ApiAndNameSchema,
  ): Promise<PrivacySettingsResponse> {
    const isInstanceConnected = await this.validateInstanceConnected(params)

    if (!isInstanceConnected) {
      return new AppError('Instance not connected')
    }

    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      const request = await this.apiBase.get(
        `/chat/fetchPrivacySettings/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      return privacySettingsResponse.parse(request.data)
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async updatePrivacySettings(
    params: UpdatePrivacySettingsRequest,
  ): Promise<PrivacySettingsResponse> {
    const isInstanceConnected = await this.validateInstanceConnected(params)

    if (!isInstanceConnected) {
      return new AppError('Instance not connected')
    }

    try {
      const paramsParsed = updatePrivacySettingsRequest.parse(params)
      const request = await this.apiBase.put(
        `/chat/updatePrivacySettings/${paramsParsed.instanceName}`,
        { privacySettings: paramsParsed.settings },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      return privacySettingsResponse.parse(request.data?.data)
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async updateName(params: UpdateProfileNameRequest): Promise<any> {
    const isInstanceConnected = await this.validateInstanceConnected(params)

    if (!isInstanceConnected) {
      return new AppError('Instance not connected')
    }

    try {
      const paramsParsed = updateProfileNameRequest.parse(params)
      const request = await this.apiBase.post(
        `/chat/updateProfileName/${paramsParsed.instanceName}`,
        { name: paramsParsed.name },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      if (!request.data?.update) {
        return new AppError(request.data)
      }
      return updateProfileNameResponse.parse({ status: 'success' })
    } catch (error) {
      return this.returnError(error)
    }
  }

  private async validateInstanceConnected(
    params: ApiAndNameSchema,
  ): Promise<boolean> {
    const instanceStatus = await this.instance.status(params)
    if (instanceStatus.status === 'error') {
      return false
    }
    return instanceStatus.state === 'open'
  }
}
