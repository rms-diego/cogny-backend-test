const axios = require("axios").default;

const { BASE_URL } = process.env;

const api = axios.create({
  baseURL: BASE_URL,
});

module.exports = { api };
