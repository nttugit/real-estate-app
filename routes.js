
const router = require('express').Router();
const controllers = require('./controllers');


// TEST APIs with ADDRESS
router.get('/addresses', controllers.getAddresses);
router.get('/addresses-store', controllers.getAddressesWithStore);
router.get('/addresses-store/:id', controllers.getAddressByIdWithStore);



// Danh sách nhà cho thuê của một chủ nhà
// router.get('/renting-houses/:ownerId', controllers.getOwnerSellingHousesByOwnerAnd);


// 4 APIS demo DIRTY READ

// Xem danh sách nhà bán của chủ nhà (DIRTY_READ)
router.get('/selling-houses/dirty-read/:ownerId', controllers.getOwnerSellingHousesDirtyRead);

// Danh sách nhà bán của một chủ nhà (DIRTY_READ_FIX)
router.get('/selling-houses/:ownerId', controllers.getOwnerSellingHouses);

// Cập nhật giá nhà 
router.put('/selling-houses/dirty-read/update-price', controllers.updateSellPrice);

// Reset data
// router.get('/selling-houses/dirty-read/reset', controllers.getSellingHousesByOwnerIdWithDirtyRead);



// 4 APIS DEMO PHANTOM

// PHANTOM
router.get('/renting-houses/phantom/:ownerId', controllers.getRentingHousesByOwnerIdPhanTom);
// FIX_PHANTOM
router.get('/renting-houses/phantom/fix/:ownerId', controllers.getRentingHousesByOwnerIdPhantomFix); //
// Cho thuê nhà
router.post('/renting-houses', controllers.addARentingHouse);
// Reset data để demo (nhớ truyền vào rentingHouseId)
router.put('/renting-houses/phantom/reset', controllers.resetPhantomDemoData); //


module.exports = router;
