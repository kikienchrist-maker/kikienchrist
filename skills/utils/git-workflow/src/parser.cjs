/**
 * Wrapper CJS pour conventional-commits-parser
 */
const parser = require('conventional-commits-parser');

function parseCommitMessage(message) {
  return parser(message);
}

module.exports = { parseCommitMessage };