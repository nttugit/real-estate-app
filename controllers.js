
const sql = require('mssql');
const { STORE_PROCEDURES } = require('./database')
const { generateID } = require("./utils")
const controllers = {};



// TEST
controllers.getAddresses = async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM DiaChi'); // Replace 'your_table' with your actual table name
        return res.json(result.recordset);
    } catch (err) {
        console.error('Error querying the database:', err);
    }
}

controllers.getAddressesWithStore = async (req, res) => {
    try {
        const request = new sql.Request();
        const data = await request.execute('USP_testStores');
        const result = data ? data.recordset : {};
        return res.json(result);
    } catch (err) {
        console.log("error: ", err)
    }
}

controllers.getAddressByIdWithStore = async (req, res) => {
    try {
        const { id } = req.params;
        const request = new sql.Request();
        request.input('maDiaChi', sql.VarChar, id);
        const data = await request.execute('USP_testStoreWithParams');
        const result = data ? data.recordset : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}

// 
controllers.getOwnerSellingHouses = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const request = new sql.Request();
        request.input('maChuNha', sql.VarChar, ownerId);
        const data = await request.execute(STORE_PROCEDURES.DIRTY_READ.getOwnerSellingHousesFix);
        console.log("data", data)
        const result = data ? data.recordsets : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}

// Xem giá nhà của chủ nhà (FIX_DIRTY_READ)
controllers.getSellingHousesByOwnerId = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const request = new sql.Request();
        request.input('maChuNha', sql.VarChar, ownerId);
        const data = await request.execute(STORE_PROCEDURES.DIRTY_READ.getOwnerSellingHouses);
        const result = data ? data.recordset : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}



// Cập nhật giá bán nhà
controllers.updateSellPrice = async (req, res) => {
    try {
        const { sellingHouseId, price } = req.body;
        const request = new sql.Request();
        request.input('maNhaBan', sql.VarChar, sellingHouseId);
        request.input('giaBan', sql.Float, price);

        const data = await request.execute(STORE_PROCEDURES.DIRTY_READ.updateSellPrice);

        let result = data?.rowsAffected > 0 ? "Update succeeded" : "Update Failed";

        return res.json(result);
    } catch (err) {
        // return res.json("Error: " + err.message);
        return res.json("Error: Giá nhà không được trên 1000 tỷ.");
    }
}

// DIRTY_READ
// Xem danh sách nhà bán của chủ nhà (uncommitted)
controllers.getOwnerSellingHousesDirtyRead = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const request = new sql.Request();
        request.input('maChuNha', sql.VarChar, ownerId);
        const data = await request.execute(STORE_PROCEDURES.DIRTY_READ.getOwnerSellingHouses);
        const result = data ? data.recordset : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}



// CHO THUÊ NHÀ 

controllers.getRentingHousesByOwnerId = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const request = new sql.Request();
        request.input('maChuNha', sql.VarChar, ownerId);
        const data = await request.execute(STORE_PROCEDURES.COMMON.getOwnerRentingHouses);
        const result = data ? data.recordsets : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}

controllers.addARentingHouse = async (req, res) => {
    try {
        // Mã nhà cho thuê nên generate tự động 
        const { houseId, ownerId, rentalPrice, period } = req.body;
        const rentingHouseId = generateID(7);
        const request = new sql.Request();
        request.input('maNha', sql.VarChar, houseId);
        request.input('maChuNha', sql.VarChar, ownerId);
        request.input('maNhaChoThue', sql.VarChar, rentingHouseId);
        request.input('tienThue1Thang', sql.Float, rentalPrice);
        request.input('thoiHanThue', sql.Int, period);

        const data = await request.execute(STORE_PROCEDURES.PHANTOM.addARentingHouse);
        const result = (data && data.returnValue == 1) ? "Rollback" : (data.recordset || {});

        return res.json(result);

    } catch (err) {
        console.log(err)
        return res.json("Error")
    }
}

// PHANTOM
// Read committed (bị lỗi phantom)
controllers.getRentingHousesByOwnerIdPhanTom = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const request = new sql.Request();
        request.input('maChuNha', sql.VarChar, ownerId);
        const data = await request.execute(STORE_PROCEDURES.PHANTOM.getOwnerRentingHouses);
        const result = data ? data.recordsets : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}


// FIX_PHANTOM
controllers.getRentingHousesByOwnerIdPhantomFix = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const request = new sql.Request();
        request.input('maChuNha', sql.VarChar, ownerId);
        const data = await request.execute(STORE_PROCEDURES.PHANTOM.getOwnerRentingHousesFix);
        const result = data ? data.recordsets : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}

// API reset data
controllers.resetPhantomDemoData = async (req, res) => {
    try {
        // Set cứ data luôn
        // const { rentingHouseId, ownerId } = req.body;
        const request = new sql.Request();
        // request.input('maNhaChoThue', sql.VarChar, rentingHouseId);
        // request.input('maChuNha', sql.VarChar, ownerId);

        const data = await request.execute(STORE_PROCEDURES.PHANTOM.resetDemoData);
        const result = data ? data.recordsets : {};
        return res.json(result);
    } catch (err) {
        return res.json("Error")
    }
}

module.exports = controllers;