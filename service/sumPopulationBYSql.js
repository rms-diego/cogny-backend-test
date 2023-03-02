const sumPopulationBySQL = async (dbClient) => {
  const query = `
    SELECT SUM((doc_record->> 'Population')::int) as "Population"
    FROM rms_diego.api_data
    WHERE doc_record->>'Year' IN ('2018', '2019', '2020')
  `;

  const [{ Population }] = await dbClient.query(query);

  return `\n[SQL] População somada dos anos 2018, 2019, 2020: ${Population}\n`;
};

module.exports = { sumPopulationBySQL };
