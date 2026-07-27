const { trivialJsValue } = require('./_lib/trivial-js.js');

module.exports = function handler(req, res) {
  res.status(200).json({ ok: true, trivialJsValue });
};
