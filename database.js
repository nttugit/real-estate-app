const sql = require('mssql')
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

const STORE_PROCEDURES = {
    COMMON: {
        'getOwnerRentingHouses': 'USP_DanhSachNhaChoThueCuaChuNha',
    },
    DIRTY_READ: {
        // ok
        'getOwnerSellingHouses': 'USP_XemDanhSachNhaBanCuaChuNhaDirtyRead',
        'getOwnerSellingHousesFix': 'USP_XemDanhSachNhaBanCuaChuNhaDirtyReadFix',
        'updateSellPrice': 'USP_CapNhatGiaBanNha'
    },
    LOST_UPDATE: {

    },
    PHANTOM: {
        // ok
        'getOwnerRentingHouses': 'USP_XemSoLuongNhaChoThueCuaChuNhaPhanTom',
        'getOwnerRentingHousesFix': 'USP_XemSoLuongNhaChoThueCuaChuNhaPhantomFix',
        'addARentingHouse': 'USP_ChoThueNha',
        'resetDemoData': 'USP_ResetPhantomDemoData',
    },
    UNREPEATABLE_READ: {

    },
    DEADLOCK: {

    },
    TEST: {
        'showOwnerSellingHouses': 'USP_testStoreXemDanhSachNhaBanCuaChuNha',
        'showSellingHouses': 'USP_testStoreXemDanhSachNhaBan'
    }
}

module.exports = {
    connectToSqlServer,
    STORE_PROCEDURES
}