import v1_7_4 from '@/lib/versions/v1.7.4'

import { EvolutionVersion } from '@/contracts/EvoSDK'

import { Instance } from '@/baselib/instance'
import { Profile } from '@/baselib/profile'

export enum Libs {
  INSTANCE = 'instance',
  PROFILE = 'profile',
}

export class VersionManager {
  constructor(private version: EvolutionVersion) {}

  async getProfile(
    ...constructorParams: ConstructorParameters<typeof Profile>
  ): Promise<Profile> {
    const ProfileClass = await this.getVersionLib(Libs.PROFILE)

    return new ProfileClass(...constructorParams)
  }

  async getInstance(
    ...constructorParams: ConstructorParameters<typeof Instance>
  ): Promise<Instance> {
    const InstanceClass = await this.getVersionLib(Libs.INSTANCE)

    return new InstanceClass(...constructorParams)
  }

  private async getVersionLib(lib: Libs): Promise<any> {
    const version = this.version

    if (version === '1.7.4') {
      return v1_7_4[lib]
    }
    throw new Error(`Version ${version} not supported`)
  }
}
