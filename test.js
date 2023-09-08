const sql = require('mssql')
require('dotenv').config();
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    // port: 1433,
    server: 'NTTU\\SQLEXPRESS',
    // server: process.env.DB_SERVER,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }

}

async function connectToSqlServer() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Error connecting to SQL Server:', err);
    }
}

async function disConnectToSqlServer() {
    try {
        sql.close();
        console.log('Disconnect to SQL Server');
    } catch (err) {
        console.error('Error connecting to SQL Server:', err);
    }
}

async function runStoredProcedure() {
    try {
        const pool = await sql.connect(config);

        // Execute the stored procedure
        const result = await pool.request()
            .execute('USP_testStores'); // Replace with your actual stored procedure name

        console.log(result.recordset); // This will contain the output from the stored procedure

    } catch (err) {
        console.error('Error running the stored procedure:', err);
    }
}

async function getAddressById(id) {
    try {
        const request = new sql.Request();
        request.input('maDiaChi', sql.VarChar, id);
        const result = await request.execute('USP_testStoreWithParams');
        console.log(result.recordset);
        return result;
    } catch (err) {
        console.error('Error running the stored procedure:', err);
    }
}

async function main() {
    await connectToSqlServer();

    // await runStoredProcedure();
    await getAddressById('DC00001');

    disConnectToSqlServer();
}

main();