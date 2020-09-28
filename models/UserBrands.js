const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class UserBrands {
    constructor(userId, brandId) {
        this.id = uuidv4();
        this.userId = userId;
        this.brandId = brandId;
    }

    async save() {
        const userCarBrand = await pool.query("INSERT INTO user_brands_of_cars (user_brands_of_cars_uid, user_uid, brand_of_car_uid) VALUES($1, $2, $3) RETURNING *", [this.id, this.userId, this.brandId]);
        return userCarBrand;
    }
}

module.exports = UserBrands;