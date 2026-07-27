const { Resend } = require('resend');

function createResendClient(apiKey) {
  return new Resend(apiKey);
}

module.exports = { createResendClient };
