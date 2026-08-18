const crypto = require("crypto");

const generateSessionToken = () => {
  return crypto.randomBytes(16).toString("hex");
};

module.exports = generateSessionToken;