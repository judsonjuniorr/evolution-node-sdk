# Evolution Node SDK
*Made by [HEROwCode](https://github.com/judsonjuniorr)*

Non official SDK for [Evolution API](https://github.com/EvolutionAPI/evolution-api).

[![Maintainer](https://img.shields.io/badge/maintainer-%40judsonjuniorr-%239580FF?style=plastic)](https://judsoncairo.com)
[![Source Code](https://img.shields.io/badge/source-judsonjuniorr/evolution--node--sdk-%239580FF?style=plastic)](https://github.com/judsonjuniorr/evolution-node-sdk)
[![Latest Version](https://img.shields.io/github/release/judsonjuniorr/evolution-node-sdk.svg?style=plastic&color=%239580FF)](https://github.com/judsonjuniorr/evolution-node-sdk/releases)
![GitHub License](https://img.shields.io/github/license/judsonjuniorr/evolution-node-sdk)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/judsonjuniorr/evolution-node-sdk/npm.yml)
![Total Downloads](https://img.shields.io/npm/d18m/%40herowcode%2Fevolution-node-sdk)


## Installation

Install Evolution Node SDK with npm

```bash
npm add evolution-node-sdk
```
```bash
yarn add evolution-node-sdk
```
```bash
pnpm add evolution-node-sdk
```
```bash
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