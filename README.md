# Domino Foundation Verified Token List

A comprehensive, up-to-date list of tokens verified by the Domino Foundation. This repository provides a standardized list of tokens that have undergone verification to ensure authenticity and quality.

## Overview

The Domino Foundation Verified Token List serves as a trustworthy source for verified tokens. Each token in this list has been reviewed and approved by the Domino Foundation verification team. Applications, wallets, and other services can use this list to identify verified tokens and protect users from scams and fraudulent tokens.

## Token List

The main token list is available at:

- JSON: [tokens.json](./tokens.json)

## Adding a New Token

To submit a new token for verification, please follow these steps:

1. Fork this repository
2. Create a new token file in the `src/tokens/` directory following the naming convention `[symbol].json` (lowercase)
3. Add your token details following the schema below
4. Add your token logo to the `assets/logos/` directory (PNG format, 256x256px recommended)
5. Submit a pull request

### Token Schema

```json
{
  "name": "Token Name",
  "symbol": "TKN",
  "address": "TokenMintAddressHere...",
  "decimals": 9,
  "description": "A brief description of the token",
  "logo": "https://github.com/Domino-Blockchain/token-list/main/assets/logos/tkn.png",
  "website": "https://example.com",
  "twitter": "https://twitter.com/example",
  "discord": "https://discord.gg/example",
  "tags": ["tag1", "tag2"],
  "verified": false,
  "verifiedBy": "",
  "verificationDate": ""
}
```

The `verified`, `verifiedBy`, and `verificationDate` fields will be updated by the Domino Foundation after review.

## Verification Process

The Domino Foundation verification team reviews token submissions based on:

1. Project legitimacy
2. Token contract audit status
3. Community trust and adoption
4. Compliance with regulatory requirements
5. Team identification and background

The verification process typically takes 3-5 business days.

## Using the Token List

The token list can be accessed directly via:

```
https://github.com/Domino-Blockchain/token-list/main/tokens.json
```

### JavaScript Example

```javascript
async function getTokenList() {
  const response = await fetch(
    "https://github.com/Domino-Blockchain/token-list/main/tokens.json"
  );
  const tokenList = await response.json();
  return tokenList;
}
```

## License

This repository is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

For questions or support, please open an issue or contact the Domino Foundation.
