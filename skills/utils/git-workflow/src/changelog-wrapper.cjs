/**
 * Wrapper CJS pour conventional-changelog
 */
const conventionalChangelog = require('conventional-changelog');

function generateChangelogRaw(options) {
  return new Promise((resolve, reject) => {
    const stream = conventionalChangelog(options);
    let data = '';
    stream.on('data', (chunk) => { data += chunk.toString(); });
    stream.on('end', () => resolve(data));
    stream.on('error', reject);
  });
}

module.exports = { generateChangelogRaw };