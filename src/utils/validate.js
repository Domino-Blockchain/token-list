const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const ajv = new Ajv();

// Define schema for token files
const tokenSchema = {
  type: 'object',
  required: ['name', 'symbol', 'address', 'decimals', 'description', 'logo'],
  properties: {
    name: { type: 'string', minLength: 1 },
    symbol: { type: 'string', minLength: 1 },
    address: { type: 'string', minLength: 32 },
    decimals: { type: 'integer', minimum: 0 },
    description: { type: 'string' },
    logo: { type: 'string', format: 'uri' },
    website: { type: 'string', format: 'uri' },
    twitter: { type: 'string', format: 'uri' },
    discord: { type: 'string', format: 'uri' },
    telegram: { type: 'string', format: 'uri' },
    tags: { 
      type: 'array',
      items: { type: 'string' }
    },
    verified: { type: 'boolean' },
    verifiedBy: { type: 'string' },
    verificationDate: { type: 'string', format: 'date' }
  },
  additionalProperties: false
};

// Define schema for main token list
const tokenListSchema = {
  type: 'object',
  required: ['name', 'version', 'timestamp', 'tokens'],
  properties: {
    name: { type: 'string' },
    version: {
      type: 'object',
      required: ['major', 'minor', 'patch'],
      properties: {
        major: { type: 'integer' },
        minor: { type: 'integer' },
        patch: { type: 'integer' }
      }
    },
    timestamp: { type: 'string', format: 'date-time' },
    tokens: {
      type: 'array',
      items: {
        type: 'object',
        required: ['name', 'symbol', 'address', 'decimals', 'verified'],
        properties: {
          name: { type: 'string' },
          symbol: { type: 'string' },
          address: { type: 'string' },
          decimals: { type: 'integer' },
          logo: { type: 'string' },
          tags: { 
            type: 'array',
            items: { type: 'string' }
          },
          verified: { type: 'boolean' },
          verifiedBy: { type: 'string' }
        }
      }
    }
  }
};

const validateToken = ajv.compile(tokenSchema);
const validateTokenList = ajv.compile(tokenListSchema);

// Validate individual token files
const tokensDir = path.join(__dirname, '../../src/tokens');
const tokenFiles = fs.readdirSync(tokensDir).filter(file => file.endsWith('.json'));

let hasErrors = false;

console.log('Validating individual token files...');
tokenFiles.forEach(file => {
  const filePath = path.join(tokensDir, file);
  try {
    const tokenData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const valid = validateToken(tokenData);
    
    if (!valid) {
      console.error(`❌ ${file} validation failed:`, validateToken.errors);
      hasErrors = true;
    } else {
      console.log(`✅ ${file} is valid`);
      
      // Check if logo file exists
      /*const logoPath = tokenData.logo.replace(
        'https://github.com/Domino-Blockchain/token-list/main/assets/logos/',
        path.join(__dirname, '../../assets/logos/')
      );
      
      if (!fs.existsSync(logoPath) && !logoPath.startsWith('http')) {
        console.error(`❌ Logo file for ${file} not found at: ${logoPath}`);
        hasErrors = true;
      }*/
    }
  } catch (error) {
    console.error(`❌ Error parsing ${file}:`, error.message);
    hasErrors = true;
  }
});

// Validate main token list
console.log('\nValidating main token list...');
const tokenListPath = path.join(__dirname, '../../tokens.json');
try {
  const tokenListData = JSON.parse(fs.readFileSync(tokenListPath, 'utf8'));
  const valid = validateTokenList(tokenListData);
  
  if (!valid) {
    console.error('❌ tokens.json validation failed:', validateTokenList.errors);
    hasErrors = true;
  } else {
    console.log('✅ tokens.json is valid');
    
    // Check that all addresses in the token list are unique
    const addresses = new Set();
    let duplicateFound = false;
    
    tokenListData.tokens.forEach(token => {
      if (addresses.has(token.address)) {
        console.error(`❌ Duplicate token address found: ${token.address} (${token.symbol})`);
        duplicateFound = true;
        hasErrors = true;
      }
      addresses.add(token.address);
    });
    
    if (!duplicateFound) {
      console.log('✅ All token addresses are unique');
    }
  }
} catch (error) {
  console.error('❌ Error parsing tokens.json:', error.message);
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n❌ Validation failed with errors');
  process.exit(1);
} else {
  console.log('\n✅ All validations passed successfully');
}