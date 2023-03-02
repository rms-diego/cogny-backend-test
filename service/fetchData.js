const { api } = require("./api");

const fetchData = async () => {
  const { data: { data } } = await api.get()

  return data;
}

module.exports = { fetchData }