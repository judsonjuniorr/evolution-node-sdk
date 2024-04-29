import { isAxiosError } from 'axios'

import { ApiAndNameSchema, apiAndNameSchema } from '@/contracts/EvoSDK'
import {
  SetSettingsRequest,
  SetSettingsResponse,
  setSettingsResponse,
  setSettingsRequest,
} from '@/contracts/instance/settings'

import { BaseLibClass } from '@/baselib/BaseLibClass'

export abstract class InstanceSettings extends BaseLibClass {
  public async fetch(params: ApiAndNameSchema): Promise<SetSettingsResponse> {
    try {
      const paramsParsed = apiAndNameSchema.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.get(
        `/settings/find/${paramsParsed.instanceName}`,
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = setSettingsResponse.parse({
        status: 'success',
        instanceName: paramsParsed.instanceName,
        settings: {
          rejectCalls: request.data.settings?.settings?.reject_call,
          rejectCallsMessage: request.data.settings?.settings?.msg_call,
          groupsIgnore: request.data.settings?.settings?.groups_ignore,
          alwaysOnline: request.data.settings?.settings?.always_online,
          readMessages: request.data.settings?.settings?.read_messages,
          readStatus: request.data.settings?.settings?.read_status,
          syncFullHistory: request.data.settings?.settings?.sync_full_history,
        },
      })
      return parsedResponse
    } catch (error) {
      return this.returnError(error)
    }
  }

  public async define(
    params: SetSettingsRequest,
  ): Promise<SetSettingsResponse> {
    try {
      const paramsParsed = setSettingsRequest.parse(params)
      this.apiKeyValidator(paramsParsed.apiKey)
      const request = await this.apiBase.post(
        `/settings/set/${paramsParsed.instanceName}`,
        {
          reject_call: paramsParsed.rejectCalls,
          msg_call: paramsParsed.rejectCallsMessage,
          groups_ignore: paramsParsed.groupsIgnore,
          always_online: paramsParsed.alwaysOnline,
          read_messages: paramsParsed.readMessages,
          read_status: paramsParsed.readStatus,
          sync_full_history: paramsParsed.syncFullHistory,
        },
        { headers: { apiKey: this.getApiKey(paramsParsed.apiKey) } },
      )
      const parsedResponse = setSettingsResponse.parse({
        status: 'success',
        instanceName: paramsParsed.instanceName,
        settings: {
          rejectCalls: request.data.settings?.settings?.reject_call,
          rejectCallsMessage: request.data.settings?.settings?.msg_call,
          groupsIgnore: request.data.settings?.settings?.groups_ignore,
          alwaysOnline: request.data.settings?.settings?.always_online,
          readMessages: request.data.settings?.settings?.read_messages,
          readStatus: request.data.settings?.settings?.read_status,
          syncFullHistory: request.data.settings?.settings?.sync_full_history,
        },
      })
      return parsedResponse
    } catch (error) {
      if (isAxiosError(error)) {
        console.log({ settingsError: JSON.stringify(error.response, null, 2) })
      }
      return this.returnError(error)
    }
  }
}

export class BaseInstanceSettings extends InstanceSettings {}
