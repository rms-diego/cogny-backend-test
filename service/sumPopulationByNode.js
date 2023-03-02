const { DATABASE_SCHEMA } = process.env;

const sumPopulationByNode = async (dbClient) => {
  const data = await dbClient[DATABASE_SCHEMA].api_data.find({
    is_active: true,
  });

  const totalPopulation = data.reduce((acc, { doc_record }) => {
    if (!doc_record.Year) return acc;

    const { Year, Population } = doc_record;

    switch (Year) {
      case "2020":
        return (acc += Population);

      case "2019":
        return (acc += Population);

      case "2018":
        return (acc += Population);

      default:
        return acc;
    }
  }, 0);

  return `\n[NODE.JS] População somada dos anos 2018, 2019, 2020: ${totalPopulation}\n`;
};

module.exports = { sumPopulationByNode };
