# Evolution Node SDK
*Made by [HEROwCode](https://github.com/judsonjuniorr)*

Non official SDK for [Evolution API](https://github.com/EvolutionAPI/evolution-api).

[![Maintainer](https://img.shields.io/badge/maintainer-%40judsonjuniorr-%239580FF?style=plastic)](https://judsoncairo.com)
[![Source Code](https://img.shields.io/badge/source-judsonjuniorr/evolution--node--sdk-%239580FF?style=plastic)](https://github.com/judsonjuniorr/evolution-node-sdk)
[![Latest Version](https://img.shields.io/github/release/judsonjuniorr/evolution-node-sdk.svg?style=plastic&color=%239580FF)](https://github.com/judsonjuniorr/evolution-node-sdk/releases)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=plastic)](LICENSE)
[![Build](https://img.shields.io/scrutinizer/build/g/judsonjuniorr/evolution-node-sdk.svg?style=plastic)](https://scrutinizer-ci.com/g/judsonjuniorr/evolution-node-sdk)
[![Quality Score](https://img.shields.io/scrutinizer/g/judsonjuniorr/evolution-node-sdk.svg?style=pplastic)](https://scrutinizer-ci.com/g/judsonjuniorr/evolution-node-sdk)
[![Total Downloads](https://img.shields.io/packagist/dt/judsonjuniorr/evolution-node-sdk.svg?style=plastic)](https://packagist.org/packages/judsonjuniorr/evolution-node-sdk)
## Installation

Install Evolution Node SDK with npm

```bash
  npm add evolution-node-sdk
  yarn add evolution-node-sdk
  pnpm add evolution-node-sdk
  bun add evolution-node-sdk
```

## Usage/Examples

```typescript
import EvoSDK from 'evolution-node-sdk'

const sdk = new EvoSDK({
  url: 'https://your-evolution-endpoint.com',
  globalApiKey: 'YOUR_API_KEY',
})

await sdk.init({ version: '1.7.4' })

await sdk.instance.fetch({
  instanceName: 'evolution-node-sdk'
})
```


## Features

- Instance management
- Instance settings
- Profile management
- Instance integrations:
  - Proxy
  - Webhook


## API Reference

### Instances

```typescript
/// Create
await sdk.instance.create(...);

/// Delete
await sdk.instance.delete(...);

/// Get single
await sdk.instance.fetch(...);

/// Get list
await sdk.instance.fetchList(...);

/// Logout
await sdk.instance.logout(...);

/// Restart
await sdk.instance.restart(...);

/// Status
await sdk.instance.delete(...);
```

#### Settings

```typescript
/// Get instance settings
await sdk.instance.settings.fetch(...);

/// Define instance settings
await sdk.instance.settings.define(...);
```

#### Proxy integration

```typescript
/// Get proxy info
await sdk.instance.integrations.proxy.fetch(...);

/// Define instance proxy
await sdk.instance.integrations.proxy.define(...);

/// Remove proxy
await sdk.instance.integrations.proxy.remove(...);
```

#### Webhook integration

```typescript
/// Get webhook info
await sdk.instance.integrations.webhook.fetch(...);

/// Define instance webhook
await sdk.instance.integrations.webhook.define(...);

/// Remove webhook
await sdk.instance.integrations.webhook.remove(...);
```


### Profile

```typescript
/// Get whatsapp profile
await sdk.profile.fetch(...);

/// Get whatsapp business profile
await sdk.profile.fetchBusiness(...);

/// Get privacy settings
await sdk.profile.privacySettings(...);

/// Update privacy settings
await sdk.profile.updatePrivacySettings(...);

/// Update name
await sdk.profile.updateName(...);
```


## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.

Please adhere to this project's `code of conduct`.


## Related

Here are some related projects

- [Evolution API](https://github.com/EvolutionAPI/evolution-api)
- [Evolution Docs](https://github.com/EvolutionAPI/evolution-api)
- [Evolution Manager](https://github.com/EvolutionAPI/evolution-api)


## License

The MIT License (MIT). Please see [License File](https://github.com/judsonjuniorr/evolution-node-sdk/blob/master/LICENSE) for more information.