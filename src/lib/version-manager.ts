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

  private async getVersionLib(lib: Libs) {
    const version = this.version

    const { default: Class } = await import(`./versions/v${version}/${lib}`)
    if (!Class) throw new Error('❌ Invalid version')

    return Class
  }
}
