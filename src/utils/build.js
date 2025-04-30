const fs = require('fs');
const path = require('path');

// Paths
const tokensDir = path.join(__dirname, '../../src/tokens');
const outputPath = path.join(__dirname, '../../tokens.json');

const tokenFiles = fs.readdirSync(tokensDir).filter(file => file.endsWith('.json'));

// Create token list structure
const tokenList = {
  name: "Domino Foundation Verified Token List",
  version: {
    major: 1,
    minor: 0,
    patch: 0
  },
  timestamp: new Date().toISOString(),
  tokens: []
};

// Process each token file
console.log('Building token list from individual token files...');
tokenFiles.forEach(file => {
  const filePath = path.join(tokensDir, file);
  try {
    const tokenData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add token to the main list with essential fields
    tokenList.tokens.push({
      name: tokenData.name,
      symbol: tokenData.symbol,
      address: tokenData.address,
      decimals: tokenData.decimals,
      logo: tokenData.logo,
      tags: tokenData.tags || [],
      verified: tokenData.verified,
      verifiedBy: tokenData.verifiedBy
    });
    
    console.log(`✅ Added ${tokenData.symbol} to token list`);
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    process.exit(1);
  }
});

// Sort tokens alphabetically by symbol
tokenList.tokens.sort((a, b) => a.symbol.localeCompare(b.symbol));

// Write the token list to file
fs.writeFileSync(outputPath, JSON.stringify(tokenList, null, 2));
console.log(`\n✅ Token list built successfully with ${tokenList.tokens.length} tokens`);