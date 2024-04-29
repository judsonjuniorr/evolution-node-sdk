import axios, { AxiosInstance } from 'axios'

import {
  EvoSDKConstructor,
  EvoSDKConstructorSchema,
  EvolutionVersion,
} from '@/contracts/EvoSDK'

import { Instance } from '@/baselib/instance'
import { Profile } from '@/baselib/profile'

import { VersionManager } from './lib/version-manager'

export default class EvoSDK {
  private apiBase: AxiosInstance
  private globalApiKey: string | undefined

  public instance: Instance = {} as Instance
  public profile: Profile = {} as Profile

  constructor(params: EvoSDKConstructor) {
    const data = EvoSDKConstructorSchema.parse(params)

    this.globalApiKey = data.globalApiKey
    this.apiBase = axios.create({
      baseURL: data.url,
      headers: {
        'X-From': 'Evolution NodeJS SDK',
        apiKey: this.globalApiKey,
      },
    })
  }

  public async init({ version }: { version: EvolutionVersion }) {
    try {
      const response = await this.apiBase.get('/')
      const message = `${response.data?.message?.toLowerCase()}`
      if (!message.includes('evolution api')) {
        throw new Error('❌ Is not a valid Evolution API')
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('❌ URL not working')
    }

    const versionManager = new VersionManager(version)

    this.instance = await versionManager.getInstance(
      this.apiBase,
      this.globalApiKey,
    )

    this.profile = await versionManager.getProfile(
      this.instance,
      this.apiBase,
      this.globalApiKey,
    )
  }
}
