const { DATABASE_SCHEMA } = process.env;

const sumPopulationByNode = async (dbClient) => {
  const data = await dbClient[DATABASE_SCHEMA].api_data.find({
    is_active: true,
  });
  
  const { doc_record: { data: populationArr } } = data.find(element => element.doc_record?.data)

  const totalPopulation = populationArr.reduce((acc, currentValue) => {
    const { Year, Population } = currentValue;

    switch(Year) {
      case "2020": 
        return acc += Population;

      case "2019": 
        return acc += Population;

      case "2018": 
        return acc += Population;

      default: 
        return acc;
    }
  }, 0)

  return `\n[NODE.JS] População somada dos anos 2018, 2019, 2020: ${totalPopulation}\n`
};

module.exports = { sumPopulationByNode };