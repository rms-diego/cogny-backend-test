const { DATABASE_SCHEMA, DATABASE_URL, SHOW_PG_MONITOR } = require('./config');
const massive = require('massive');
const monitor = require('pg-monitor');

const { fetchData } = require('./service/fetchData');
const { sumPopulationByNode } = require('./service/sumPopulationByNode');
const { sumPopulationBySQL } = require('./service/sumPopulationBySql');


// Call start
(async () => {
    console.log('main.js: before start');

    const db = await massive({
        connectionString: DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }, {
        // Massive Configuration
        scripts: process.cwd() + '/migration',
        allowedSchemas: [DATABASE_SCHEMA],
        whitelist: [`${DATABASE_SCHEMA}.%`],
        excludeFunctions: true,
    }, {
        // Driver Configuration
        noWarnings: true,
        error: function (err, client) {
            console.log(err);
            //process.emit('uncaughtException', err);
            //throw err;
        }
    });

    if (!monitor.isAttached() && SHOW_PG_MONITOR === 'true') {
        monitor.attach(db.driverConfig);
    }

    const execFileSql = async (schema, type) => {
        return new Promise(async resolve => {
            const objects = db['user'][type];

            if (objects) {
                for (const [key, func] of Object.entries(objects)) {
                    console.log(`executing ${schema} ${type} ${key}...`);
                    await func({
                        schema: DATABASE_SCHEMA,
                    });
                }
            }

            resolve();
        });
    };

    //public
    const migrationUp = async () => {
        await execFileSql(DATABASE_SCHEMA, 'schema');

        //cria as estruturas necessárias no db (schema)
        await execFileSql(DATABASE_SCHEMA, 'table');
        await execFileSql(DATABASE_SCHEMA, 'view');

        console.log(`reload schemas ...`)
        await db.reload();
    };

    try {
        await migrationUp();

        // fazendo o data fetching da api
        const data = await fetchData();

        //exemplo de insert
        const result1 = await db[DATABASE_SCHEMA].api_data.insert({
            doc_record: { 'a': 'b' },
        })

        // inserindo os dados da api no banco de dados
        data.forEach(async element => {
            await db[DATABASE_SCHEMA].api_data.insert({
                doc_record:  element,
            });
        });


        console.log('Data inserido na tabela');
        console.log('result1 >>>', result1);

        //exemplo select
        const result2 = await db[DATABASE_SCHEMA].api_data.find({
            is_active: true
        });
        console.log('result2 >>>', result2);

        const totalSumPopulationByNodejs = await sumPopulationByNode(db);
        console.log(totalSumPopulationByNodejs);

        const totalSumPopulationBySQL = await sumPopulationBySQL(db);
        console.log(totalSumPopulationBySQL);

        // limpando o banco ao final do script
        await db[DATABASE_SCHEMA].api_data.destroy({});
        console.log("Limpando tabela");

    } catch (e) {
        console.log(e.message)
    } finally {
        console.log('finally');
    }
    console.log('main.js: after start');
})();