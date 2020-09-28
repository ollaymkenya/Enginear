const pool = require("../utils/db");
const { v4: uuidv4 } = require('uuid');

class CarBrand {
    constructor(name) {
        this.id = uuidv4();
        this.name = name;
    }

    async save() {
        const carBrand = await pool.query("insert INTO brand_of_car(brand_of_car_uid, brand_of_car_name)VALUES($1, $2) RETURNING *", [this.id, this.name])
        return carBrand;
    }

    static async getCarBrands(){
        const carBrands = await pool.query("SELECT * FROM brand_of_car");
        return carBrands.rows;
    }

    static async getCarBrand(id) {
        const carBrand = await pool.query("SELECT * FROM brand_of_car WHERE brand_of_car_uid = $1", [id]);
        return carBrand;
    }
}

module.exports = CarBrand;